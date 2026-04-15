import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from './jwt.strategy';
import { AdminGuard } from './admin.guard';
import { ResidentGuard } from './resident.guard';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AdminGuard, ResidentGuard],
  exports: [AuthService, AdminGuard, ResidentGuard, JwtModule],
})
export class AuthModule {}
