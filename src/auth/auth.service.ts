import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

        constructor(
        // private userService: UserService,

    ){}


        //register user
    async register(registeruserdto: RegisterUserDto){
        const existingUser = await this.userService.findUser(registeruserdto.email)

        if(existingUser){
            throw new BadRequestException("User Already Exist")
        }

        // const salt = await bcrypt.gensalt(12)
        const hash = await bcrypt.hash(registeruserdto.password, 12);

        const userName: string = `${registeruserdto.firstName.trim()} ${registeruserdto.lastName.trim()}`;

        const user =  await this.userService.create({
            userName,
            password: hash,
            email: registeruserdto.email,
            phoneNumber: registeruserdto.phoneNumber,
        });

    }

}
