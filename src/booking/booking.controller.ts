import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {

    constructor(
        private bookingService: BookingService
    ){}

    @Post()
    createRoom(
        @Param('userId') userId: string, 
        @Body() createBookingDto: CreateBookingDto){
            return this.bookingService.createBooking(createBookingDto, userId)
        }
}
