import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Min } from "class-validator";

export class CreateRoomDto{

    @IsNotEmpty()
    @IsString()
    roomType!:  string;

    @IsNotEmpty()
    price!:  number;

    @IsNotEmpty()
    @Min(1)
    maxGuests!:  number;

    @IsNotEmpty()
    floor!:  number;

    @IsNotEmpty()
    @Transform(({value})=>Boolean(value))
    isAvailable!:  boolean;

}


