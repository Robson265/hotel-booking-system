import { Body, Controller, Get, Patch, Post, Query,Param, Delete  } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from 'src/dto/create-room.dto';
import { UpdateRoomDto } from 'src/dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService
    ){}

    @Post()
    createRoom(
        @Param('hotelId') hotelId: string, 
        @Body() createRoomDto: CreateRoomDto){
        return this.roomsService.createRoom(hotelId, createRoomDto)
    }


    @Get()
    searchAvailableRooms(@Param("hotelId") hotelId: string){
        return this.roomsService.searchAvailableRoom(hotelId)
    }


    @Get(':id')
    getRoom(@Param("id") id: string){
        return this.roomsService.getRoom(id)
    }

    @Patch(':roomId')
    updateRoom(
        @Param("id") id: string, 
        @Body() updateRoomDto: UpdateRoomDto){
        return this.roomsService.updateRoom(id, updateRoomDto)
        }

}
