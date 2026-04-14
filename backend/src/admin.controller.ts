import { Controller, Get, Put, Post, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateResidentDto, AdminUpdateResidentDto } from './dto/resident.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('staff')
  async getStaffAccounts(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.adminService.getStaffAccounts(status, +page, +limit);
  }

  @Put('staff/:id/approve')
  async approveStaffAccount(@Param('id') id: string) {
    return this.adminService.approveStaffAccount(+id);
  }

  @Put('staff/:id/reject')
  async rejectStaffAccount(@Param('id') id: string) {
    return this.adminService.rejectStaffAccount(+id);
  }

  @Get('residents')
  async getResidents(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.getResidents(status, +page, +limit, search);
  }

  @Post('residents')
  async createResident(@Body(ValidationPipe) data: CreateResidentDto) {
    return this.adminService.createResident(data);
  }

  @Put('residents/:id')
  async updateResident(
    @Param('id') id: string,
    @Body(ValidationPipe) data: AdminUpdateResidentDto,
  ) {
    return this.adminService.updateResident(+id, data);
  }

  @Put('residents/:id/approve')
  async approveResident(@Param('id') id: string) {
    return this.adminService.approveResident(+id);
  }

  @Put('residents/:id/reject')
  async rejectResident(@Param('id') id: string) {
    return this.adminService.rejectResident(+id);
  }

  @Put('residents/:id/status')
  async updateResidentStatus(@Param('id') id: string, @Query('status') status: 'Active' | 'Inactive') {
    return this.adminService.updateResidentStatus(+id, status);
  }
}
