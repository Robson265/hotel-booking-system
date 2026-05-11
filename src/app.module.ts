import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppService } from './app.service';
import { PrismaModule } from 'src/config/prisma.module';


@Module({
  controllers: [AppController],
  providers: [AppService],

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
