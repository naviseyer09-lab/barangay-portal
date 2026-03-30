import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminRegisterDto, AdminLoginDto } from './dto/admin.dto';
import { ResidentRegisterDto, ResidentLoginDto } from './dto/resident.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/register')
  async registerAdmin(@Body(ValidationPipe) data: AdminRegisterDto) {
    return this.authService.registerAdmin(data);
  }

  @Post('admin/login')
  async loginAdmin(@Body(ValidationPipe) data: AdminLoginDto) {
    return this.authService.loginAdmin(data);
  }

  @Post('resident/register')
  async registerResident(@Body(ValidationPipe) data: ResidentRegisterDto) {
    return this.authService.registerResident(data);
  }

  @Post('resident/login')
  async loginResident(@Body(ValidationPipe) data: ResidentLoginDto) {
    return this.authService.loginResident(data);
  }
}
