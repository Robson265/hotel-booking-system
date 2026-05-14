import { IsIn, IsOptional, IsString } from "class-validator";


export class UpdateBookingDto{

    @IsString()
    @IsOptional()
    @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    status?: string;

    @IsString()
    @IsOptional()
    reason?: string
}