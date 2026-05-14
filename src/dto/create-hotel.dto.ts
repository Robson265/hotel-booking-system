import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Max, min, Min } from "class-validator";

export class CreateHotelDto{

    @IsNotEmpty()
    @IsString()
    name!:  string;

    @IsNotEmpty()
    address!:  string;

    @IsNotEmpty()
    @Min(1)
    description!:  string;

    @IsNotEmpty()
    city!:  string;

    @IsNotEmpty()
    state!:  string;

    @IsNotEmpty()
    country!:  string;

    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating!:  number;

    @IsNotEmpty()
    amenities!:  string;

    @IsNotEmpty()
    longitude!:  string;

    @IsNotEmpty()
    latitude!:  string;

    @IsNotEmpty()
    checkInTime!:  string;

    @IsNotEmpty()
    checkOutTime!:  string;

    @IsNotEmpty()
    @Transform(({value})=>Boolean(value))
    isApproved!:  boolean;

}


