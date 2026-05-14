import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateBookingDto } from 'src/dto/create-booking.dto';

@Injectable()
export class BookingService {
    constructor(private prisma: PrismaService){}

    async createBooking(createBookingDto: CreateBookingDto, userId: string){
        const today = new Date();
        today.setHours(0,0,0,0);

        const checkIn = new Date(createBookingDto.checkIn);
        const checkOut = new Date(createBookingDto.checkOut);

        if(checkIn<today){
            throw new BadRequestException("check-in date must be today or future date")
        }

        if(checkOut<=checkIn){
            throw new BadRequestException("Check-out must be strictly after check-in. Same day Booking is NOt permitted")
        }


        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate()+365);
        if(checkIn>maxDate){
            throw new BadRequestException("Booking cannot be made more than 365 day in advance");
        }

        const room = await this.prisma.room.findUnique({
            where:{id: createBookingDto.roomId}
        });
        if(!room)throw new BadRequestException("Room Not Found")

        if(createBookingDto.numGuests > room.maxGuests){
            throw new BadRequestException(`Number of guest Exceeds room max occupancy of ${room.maxGuests}.`)
        }

        
        const overlapping = await this.prisma.booking.findFirst({
            where:{
                roomId: createBookingDto.roomId,
                status:{in: ['PENDING', 'CONFIRMED']},
                checkIn: {lt: checkOut},
                checkOut:{gt: checkIn}
            }
        });
        if(overlapping){
            throw new BadRequestException("Room is Unavailabe for the selected Dates.")
        }

        const pendingCount = await this.prisma.booking.count({
            where:{userId, status: 'PENDING'},
        });
        if(pendingCount>= 3){
            throw new BadRequestException("You cannot have more than 3 simultaneous pending bookings")
        }

        const nights =Math.ceil(
            (checkOut.getTime() - checkIn.getTime())/ (1000 * 60 * 60 * 24)
        );

        const totalAmount = room.price*nights;

        return this.prisma.booking.create({
            data:{
                checkIn: checkIn,
                checkOut: checkOut,
                numGuests: createBookingDto.numGuests,
                totalAmount,
                status: 'PENDING',
                user: {connect: {id: userId}},
                room: {connect: {id: createBookingDto.roomId}},
                hotel: {connect: {id: createBookingDto.hotelId}},
            },
        });

    }
}
