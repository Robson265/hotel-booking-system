import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ){}

        @Get("/me")
        findUser(id: string){
            return this.usersService.findOne(id)
        }

            
        // @Patch("/me")
        //     updateProfile(@Body() updateUserDto: UpdateUserDto){
        //         return this.usersService.update()
        //     }
}
