import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


export class RegisterUserDto{

    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password too weak',
    })
    password!: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword!: string;
}