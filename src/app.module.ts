import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppService } from './app.service';
import { PrismaModule } from 'src/config/prisma.module';
import { HotelModule } from './hotel/hotel.module';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { CancellationModule } from './cancellation/cancellation.module';
import { UploadService } from './upload/upload.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UploadController } from './upload/upload.controller';


@Module({
  controllers: [AppController, ReviewController, UploadController],
  providers: [AppService, ReviewService, UploadService, CloudinaryService],

    imports: [
    PrismaModule,
    UsersModule,
    AuthModule, 
    BookingModule, 
    PaymentModule, 
    RoomsModule, HotelModule, ReviewModule, CancellationModule
  ],

})
export class AppModule {}
