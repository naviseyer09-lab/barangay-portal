import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AdminGuard } from './auth/admin.guard';

@Controller('services')
@UseGuards(AdminGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServiceRequests(@Query() query) {
    return this.servicesService.getServiceRequests(query.status, query.page, query.limit);
  }

  @Put(':id')
  async updateServiceRequest(@Param('id') id: string, @Body() data) {
    return this.servicesService.updateServiceRequest(+id, data.status, data.remarks);
  }
}
