import { Module } from '@nestjs/common';
import { ResidentService } from '../resident.service';
import { ResidentController } from '../resident.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ResidentController],
  providers: [ResidentService],
  exports: [ResidentService],
})
export class ResidentModule {}
