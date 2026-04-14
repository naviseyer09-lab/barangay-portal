import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from './database.service';
import { CreateResidentDto, AdminUpdateResidentDto } from './dto/resident.dto';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  async getStaffAccounts(status?: string, page = 1, limit = 10) {
    let query = 'SELECT id, username, email, first_name, last_name, phone, position, employee_id, role, status, created_at FROM admins WHERE role != "Super Admin"';
    let params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const staff = await this.db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM admins WHERE role != "Super Admin"';
    let countParams: any[] = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const result = await this.db.queryOne(countQuery, countParams);

    return {
      success: true,
      staff,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    };
  }

  async approveStaffAccount(id: number) {
    const result = await this.db.run(
      'UPDATE admins SET status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ? AND role != "Super Admin"',
      [id]
    );

    if (result.changes === 0) {
      throw new NotFoundException('Staff account not found');
    }

    return { success: true, message: 'Staff account approved successfully' };
  }

  async rejectStaffAccount(id: number) {
    const result = await this.db.run(
      'UPDATE admins SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ? AND role != "Super Admin"',
      [id]
    );

    if (result.changes === 0) {
      throw new NotFoundException('Staff account not found');
    }

    return { success: true, message: 'Staff account rejected' };
  }

  async getResidents(status?: string, page = 1, limit = 10, search?: string) {
    let query = `SELECT id, username, email, full_name, address, contact_number,
                 voter_status, account_status, status, created_at FROM residents`;
    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(full_name LIKE ? OR username LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const residents = await this.db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM residents';
    const countConditions: string[] = [];
    const countParams: any[] = [];

    if (status) {
      countConditions.push('status = ?');
      countParams.push(status);
    }

    if (search) {
      countConditions.push('(full_name LIKE ? OR username LIKE ? OR email LIKE ?)');
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (countConditions.length) {
      countQuery += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const result = await this.db.queryOne(countQuery, countParams);

    return {
      success: true,
      data: residents,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    };
  }

  async createResident(data: CreateResidentDto) {
    const existing = await this.db.queryOne(
      'SELECT id FROM residents WHERE username = ? OR email = ?',
      [data.username, data.email],
    );

    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await this.db.run(
      `INSERT INTO residents (username, password, email, full_name, address, contact_number, birthdate, gender, civil_status, voter_status, account_status, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.username,
        hashedPassword,
        data.email,
        data.fullName,
        data.address,
        data.contactNumber,
        data.birthdate,
        data.gender,
        data.civilStatus,
        'Not Registered',
        'Active',
        'approved',
      ],
    );

    return { success: true, message: 'Resident created successfully' };
  }

  async updateResident(id: number, data: AdminUpdateResidentDto) {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.fullName !== undefined) {
      fields.push('full_name = ?');
      params.push(data.fullName);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      params.push(data.email);
    }
    if (data.address !== undefined) {
      fields.push('address = ?');
      params.push(data.address);
    }
    if (data.contactNumber !== undefined) {
      fields.push('contact_number = ?');
      params.push(data.contactNumber);
    }
    if (data.birthdate !== undefined) {
      fields.push('birthdate = ?');
      params.push(data.birthdate);
    }
    if (data.gender !== undefined) {
      fields.push('gender = ?');
      params.push(data.gender);
    }
    if (data.civilStatus !== undefined) {
      fields.push('civil_status = ?');
      params.push(data.civilStatus);
    }
    if (data.voterStatus !== undefined) {
      fields.push('voter_status = ?');
      params.push(data.voterStatus);
    }
    if (data.accountStatus !== undefined) {
      fields.push('account_status = ?');
      params.push(data.accountStatus);
    }

    if (!fields.length) {
      return { success: true, message: 'No changes to update' };
    }

    const query = `UPDATE residents SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params.push(id);
    const result = await this.db.run(query, params);

    if (result.changes === 0) {
      throw new NotFoundException('Resident not found');
    }

    return { success: true, message: 'Resident updated successfully' };
  }

  async approveResident(id: number) {
    const result = await this.db.run(
      'UPDATE residents SET status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      throw new NotFoundException('Resident not found');
    }

    return { success: true, message: 'Resident approved successfully' };
  }

  async rejectResident(id: number) {
    const result = await this.db.run(
      'UPDATE residents SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      throw new NotFoundException('Resident not found');
    }

    return { success: true, message: 'Resident rejected' };
  }

  async updateResidentStatus(id: number, status: 'Active' | 'Inactive') {
    const result = await this.db.run(
      'UPDATE residents SET account_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    if (result.changes === 0) {
      throw new NotFoundException('Resident not found');
    }

    return { success: true, message: `Resident account ${status.toLowerCase()} successfully` };
  }
}
