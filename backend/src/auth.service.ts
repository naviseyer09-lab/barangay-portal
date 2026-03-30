import { Injectable, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from './database.service';
import { AdminRegisterDto, AdminLoginDto } from './dto/admin.dto';
import { ResidentRegisterDto, ResidentLoginDto } from './dto/resident.dto';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(data: AdminRegisterDto) {
    const db = this.db.getDb();

    // Check if username, email, or employeeId already exists
    const existing = await this.db.queryOne(
      'SELECT id FROM admins WHERE username = ? OR email = ? OR employee_id = ?',
      [data.username, data.email, data.employeeId]
    );

    if (existing) {
      throw new ConflictException('Username, email, or employee ID already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Check if this is the first admin registration
    const result = await this.db.queryOne('SELECT COUNT(*) as count FROM admins');
    const isFirstAdmin = result.count === 0;
    const role = isFirstAdmin ? 'Super Admin' : 'Staff';
    const status = isFirstAdmin ? 'approved' : 'pending';

    // Insert new admin
    await this.db.run(
      `INSERT INTO admins (username, password, email, first_name, last_name, phone, position, employee_id, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.username, hashedPassword, data.email, data.firstName, data.lastName, data.phone, data.position, data.employeeId, role, status]
    );

    const message = isFirstAdmin
      ? 'Registration successful! You are the first administrator and your account has been approved.'
      : 'Registration submitted successfully. Your account is pending approval from the barangay administrator.';

    return {
      success: true,
      message,
      isFirstAdmin,
    };
  }

  async loginAdmin(data: AdminLoginDto) {
    const db = this.db.getDb();

    // Find admin
    const admin = await this.db.queryOne('SELECT * FROM admins WHERE username = ?', [data.username]);

    if (!admin) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Check if admin account is approved
    if (admin.status !== 'approved') {
      const message = admin.status === 'pending'
        ? 'Your account is pending approval. Please contact the barangay administrator.'
        : 'Your account has been rejected. Please contact the barangay administrator.';
      throw new ForbiddenException(message);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, admin.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate token
    const token = this.jwtService.sign({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      type: 'admin'
    });

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role
      }
    };
  }

  async registerResident(data: ResidentRegisterDto) {
    const db = this.db.getDb();

    // Check if username or email already exists
    const existing = await this.db.queryOne(
      'SELECT id FROM residents WHERE username = ? OR email = ?',
      [data.username, data.email]
    );

    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Insert new resident with pending status
    await this.db.run(
      `INSERT INTO residents (username, password, email, full_name, address, contact_number, birthdate, gender, civil_status, account_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.username, hashedPassword, data.email, data.fullName, data.address, data.contactNumber, data.birthdate, data.gender, data.civilStatus, 'Active', 'pending']
    );

    return {
      success: true,
      message: 'Registration submitted successfully. Your account is pending approval from the barangay administrator.'
    };
  }

  async loginResident(data: ResidentLoginDto) {
    const db = this.db.getDb();

    // Find resident
    const resident = await this.db.queryOne('SELECT * FROM residents WHERE username = ?', [data.username]);

    if (!resident) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Check if resident account is approved
    if (resident.status !== 'approved') {
      const message = resident.status === 'pending'
        ? 'Your account is pending approval. Please contact the barangay administrator.'
        : 'Your account has been rejected. Please contact the barangay administrator.';
      throw new ForbiddenException(message);
    }

    // Check if resident account is active
    if (resident.account_status !== 'Active') {
      throw new ForbiddenException('Your account is inactive. Please contact the barangay administrator.');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, resident.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate token
    const token = this.jwtService.sign({
      id: resident.id,
      username: resident.username,
      type: 'resident'
    });

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: resident.id,
        username: resident.username,
        fullName: resident.full_name,
        email: resident.email,
        address: resident.address,
        contactNumber: resident.contact_number,
        voterStatus: resident.voter_status,
        accountStatus: resident.account_status,
        profilePicture: resident.profile_picture,
        birthdate: resident.birthdate,
        gender: resident.gender,
        civilStatus: resident.civil_status
      }
    };
  }
}
