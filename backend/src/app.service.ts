import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class AppService {
  constructor(private db: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getBarangayInfo() {
    const barangayInfo = await this.db.queryOne('SELECT * FROM barangay_info LIMIT 1');
    if (!barangayInfo) {
      throw new Error('Barangay info not found');
    }

    return {
      name: barangayInfo.name,
      captain: barangayInfo.captain,
      address: barangayInfo.address,
      contactNumber: barangayInfo.contact_number,
      email: barangayInfo.email,
      mission: barangayInfo.mission,
      vision: barangayInfo.vision,
      barangayHours: barangayInfo.barangay_hours,
      establishedYear: barangayInfo.established_year,
      population: barangayInfo.population,
      totalArea: barangayInfo.total_area,
    };
  }
}
