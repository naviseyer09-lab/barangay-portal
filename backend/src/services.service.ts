import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class ServicesService {
  constructor(private db: DatabaseService) {}

  async getServiceRequests(status?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `SELECT sr.*, r.full_name as resident_name, r.email as resident_email,
                 a.first_name || ' ' || a.last_name as processed_by_name
                 FROM service_requests sr
                 LEFT JOIN residents r ON sr.resident_id = r.id
                 LEFT JOIN admins a ON sr.processed_by = a.id`;
    let params: any[] = [];

    if (status) {
      query += ' WHERE sr.status = ?';
      params.push(status);
    }

    query += ' ORDER BY sr.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const requests = await this.db.query(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM service_requests';
    let countParams: any[] = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    const result = await this.db.queryOne(countQuery, countParams);

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

  async updateServiceRequest(id: number, status: string, remarks?: string) {
    const updates: string[] = ['status = ?'];
    const params: any[] = [status];

    if (remarks) {
      updates.push('remarks = ?');
      params.push(remarks);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await this.db.run(
      `UPDATE service_requests SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return { success: true, message: 'Service request updated successfully' };
  }
}
