import { BadRequestException, Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/config/prisma.service';
import { CreateHotelDto } from 'src/dto/create-hotel.dto';

@Injectable()
export class HotelService {
    constructor(private prisma: PrismaService){}

    async createHotel(adminId: string, createHotelDto: CreateHotelDto){
        const checkInTime = createHotelDto.checkInTime??'14:00';
        const checkOutTime = createHotelDto.checkOutTime??'12:00';

        if(checkInTime>= checkOutTime){
            throw new BadRequestException("Check-in Time must be before check-out time");
        }

        return this.prisma.hotel.create({
            data:{
                name: createHotelDto.name,
                address: createHotelDto.address,
                description: createHotelDto.description,
                country: createHotelDto.country,
                state: createHotelDto.state,
                city: createHotelDto.city,
                rating: createHotelDto.rating,
                amenities: createHotelDto.amenities,
                longitude: createHotelDto.longitude,
                latitude: createHotelDto.latitude,
                checkInTime,
                checkOutTime,
                isApproved: false,
                isActive: false,
                admin:{
                    connect:{id: adminId}
                },
            },
        });
    }

    async getApprovedHotels(){
        return this.prisma.hotel.findMany({
            where: {
                isApproved: true,
                isActive: true,
            },
        });
    }

    async approveHotel(hotelId: string){
        return this.prisma.hotel.update({
            where:{id: hotelId},
            data:{isApproved: true},
        })
    }
}
