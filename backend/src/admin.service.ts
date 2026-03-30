import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';

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
                 voter_status, account_status, created_at FROM residents`;
    let params: any[] = [];

    if (search) {
      query += ' WHERE full_name LIKE ? OR username LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const residents = await this.db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM residents';
    let countParams: any[] = [];

    if (search) {
      countQuery += ' WHERE full_name LIKE ? OR username LIKE ? OR email LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
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
