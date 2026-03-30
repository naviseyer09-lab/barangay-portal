import { Controller, Get, Put, Post, Body, Query, Req } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { UpdateResidentProfileDto } from './dto/resident.dto';

@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.residentService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Req() req, @Body() data: UpdateResidentProfileDto) {
    return this.residentService.updateProfile(req.user.id, data);
  }

  @Get('service-requests')
  async getServiceRequests(@Req() req, @Query() query) {
    return this.residentService.getServiceRequests(req.user.id, query.page, query.limit);
  }

  @Post('service-requests')
  async createServiceRequest(@Req() req, @Body() data) {
    return this.residentService.createServiceRequest(req.user.id, data);
  }

  @Get('services')
  async getServices() {
    return this.residentService.getServices();
  }

  @Get('announcements')
  async getAnnouncements(@Query() query) {
    return this.residentService.getAnnouncements(query.page, query.limit);
  }
}
