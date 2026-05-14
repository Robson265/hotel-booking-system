import { IsIn, IsInt, IsString, Min } from "class-validator"


export class CreateBookingDto{

    @IsString()
    roomId!: string;

    @IsString()
    hotelId!: string;

    @IsString()
    checkIn!: string;

    @IsString()
    checkOut!: string;

    @IsInt()
    @Min(1)
    numGuests!: number;

    @IsString()
    @IsIn(['USD', 'NGN', 'GBP', 'EUR'])
    currency!: string;

    @IsString()
    @IsIn(['STRIPE','PAYSTACK'])
    paymentProvider!: 'STRIPE' | 'PAYSTACK';
}