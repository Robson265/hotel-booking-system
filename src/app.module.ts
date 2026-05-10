import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppService } from './app.service';
import { PrismaModule } from 'src/config/prisma.module';


@Module({
  controllers: [AppController, AuthController, PaymentController],
  providers: [AppService, AuthService, PaymentService],

    imports: [
    PrismaModule,
    UsersModule,
    AuthModule, 
    BookingModule, 
    PaymentModule, 
    RoomsModule
  ],

})
export class AppModule {}
