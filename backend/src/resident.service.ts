import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class ResidentService {
  constructor(private db: DatabaseService) {}

  async getProfile(id: number) {
    const resident = await this.db.queryOne(
      'SELECT id, username, email, full_name, address, contact_number, birthdate, gender, civil_status, voter_status, account_status, profile_picture, created_at FROM residents WHERE id = ?',
      [id]
    );

    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    return { success: true, data: resident };
  }

  async updateProfile(id: number, data: any) {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.fullName) {
      updates.push('full_name = ?');
      params.push(data.fullName);
    }
    if (data.address) {
      updates.push('address = ?');
      params.push(data.address);
    }
    if (data.contactNumber) {
      updates.push('contact_number = ?');
      params.push(data.contactNumber);
    }
    if (data.email) {
      updates.push('email = ?');
      params.push(data.email);
    }
    if (data.birthdate) {
      updates.push('birthdate = ?');
      params.push(data.birthdate);
    }
    if (data.gender) {
      updates.push('gender = ?');
      params.push(data.gender);
    }
    if (data.civilStatus) {
      updates.push('civil_status = ?');
      params.push(data.civilStatus);
    }

    if (updates.length === 0) {
      throw new NotFoundException('No fields to update');
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const result = await this.db.run(
      `UPDATE residents SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.changes === 0) {
      throw new NotFoundException('Resident not found');
    }

    return { success: true, message: 'Profile updated successfully' };
  }

  async getServiceRequests(residentId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const requests = await this.db.query(
      `SELECT sr.*, a.first_name || ' ' || a.last_name as processed_by_name
       FROM service_requests sr
       LEFT JOIN admins a ON sr.processed_by = a.id
       WHERE sr.resident_id = ?
       ORDER BY sr.created_at DESC LIMIT ? OFFSET ?`,
      [residentId, limit, offset]
    );

    const result = await this.db.queryOne(
      'SELECT COUNT(*) as total FROM service_requests WHERE resident_id = ?',
      [residentId]
    );

    return {
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    };
  }

  async createServiceRequest(residentId: number, data: any) {
    const service = await this.db.queryOne(
      'SELECT processing_time FROM services WHERE name = ? AND is_active = 1',
      [data.serviceName]
    );

    if (!service) {
      throw new NotFoundException('Service not found or not available');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await this.db.run(
      `INSERT INTO service_requests (resident_id, service_name, purpose, otp_code, estimated_processing)
       VALUES (?, ?, ?, ?, ?)`,
      [residentId, data.serviceName, data.purpose, otp, service.processing_time]
    );

    return {
      success: true,
      message: 'Service request created successfully',
      data: {
        id: result.lastID,
        serviceName: data.serviceName,
        purpose: data.purpose,
        otp,
        estimatedProcessing: service.processing_time,
        status: 'Pending',
      },
    };
  }

  async getServices() {
    const services = await this.db.query(
      'SELECT id, name, description, requirements, processing_time, fee FROM services WHERE is_active = 1 ORDER BY name'
    );

    return { success: true, data: services };
  }

  async getAnnouncements(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const announcements = await this.db.query(
      `SELECT a.*, ad.first_name || ' ' || ad.last_name as created_by_name
       FROM announcements a
       LEFT JOIN admins ad ON a.created_by = ad.id
       WHERE a.status = 'Published'
       ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const result = await this.db.queryOne(
      "SELECT COUNT(*) as total FROM announcements WHERE status = 'Published'"
    );

    return {
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    };
  }
}
