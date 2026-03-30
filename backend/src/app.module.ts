import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ResidentModule } from './resident/resident.module';
import { ServicesModule } from './services/services.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [DatabaseModule, AuthModule, AdminModule, ResidentModule, ServicesModule],
  controllers: [AppController, AdminController, ResidentController, ServicesController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AdminService,
    ResidentService,
    ServicesService,
  ],
})
export class AppModule {}
