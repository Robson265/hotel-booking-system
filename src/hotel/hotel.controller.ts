import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from 'src/dto/create-hotel.dto';

@Controller('hotel')
export class HotelController {
    constructor(private hotelservice: HotelService){}

    @Get()
    SearchApproveHotel(){
        return this.hotelservice.getApprovedHotels();
    }

    @Get("/id")
    getHotels(id: string){
        return this.hotelservice.approveHotel(id);
    }

    @Post()
    // @UseGuards(JwtAuthGuard, RolesGuards)
    // @Roles('Hotel_ADMIN')
    createHotel(@Req()req, @Body() createHotelDto: CreateHotelDto){
        return this.hotelservice.createHotel(req.user.id, createHotelDto)
    }

    @Patch()
    // @UseGuards(JwtAuthGuard, RolesGuards)
    // @Roles('SUPER_ADMIN')
    approveHotel(@Param('id') id: string){
        return this.hotelservice.approveHotel(id)
    }

}
