import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { VehicleModule } from './modules/vehicles/vehicle.module';
import { EventModule } from './modules/events/event.module';
import { TicketModule } from './modules/tickets/ticket.module';
import { ApplicationModule } from './modules/applications/application.module';
import { GarageModule } from './modules/garage/garage.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    VehicleModule,
    EventModule,
    TicketModule,
    ApplicationModule,
    GarageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
