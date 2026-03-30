import { Module } from '@nestjs/common';
import { ResidentService } from '../resident.service';
import { ResidentController } from '../resident.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ResidentController],
  providers: [ResidentService],
  exports: [ResidentService],
})
export class ResidentModule {}
