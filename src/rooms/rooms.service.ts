import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateRoomDto } from 'src/dto/create-room.dto';
import { UpdateRoomDto } from 'src/dto/update-room.dto';

@Injectable()
export class RoomsService {
    constructor(
        private prisma: PrismaService
    ){}

    async createRoom(hotelId: string, createRoomDto: CreateRoomDto){
        if(createRoomDto.price<=0){
            throw new BadRequestException("Price must be greater than zero");
        }

        if(createRoomDto.maxGuests<1){
            throw new BadRequestException("Max Number Of Guest Must Be At Least 1");
        }

        try{
            return await this.prisma.room.create({
                data:{
                    roomType: createRoomDto.roomType,
                    price: createRoomDto.price,
                    floor: createRoomDto.floor,
                    maxGuests: createRoomDto.maxGuests,
                    isAvailable: createRoomDto.isAvailable?? true,
                    hotel:{
                        connect:{id: hotelId},
                    }
                }
            });
        }catch(error){
            if(error instanceof Error && (error as any).code === 'p2002'){
                throw new ConflictException("Room Number Already Exist");
            }
            throw error;
        }
    }

    async updateRoom(id: string, updateRoomDto:UpdateRoomDto){
                if(updateRoomDto.price!== undefined && updateRoomDto.price<=0){
            throw new BadRequestException("Price must be greater than zero");
        }

        if(updateRoomDto.maxGuests!== undefined && updateRoomDto.maxGuests<1){
            throw new BadRequestException("Max Number Of Guest Must Be At Least 1");
        }

        try{
            return await this.prisma.room.update({where:{id},data: updateRoomDto});
        }catch(error){
            if(error instanceof Error && (error as any).code === 'p2002'){
                throw new ConflictException("Room Number Already Exist");
            }
            throw error;
        }
    }


    async searchAvailableRoom(hotelId: string){
        return this.prisma.room.findMany({
            where:{
                hotelId, isAvailable: true
            },
        })
    }

    async getRoom(id: string){
        return this.prisma.room.findUnique({
            where: {id}
        })
    }
}
