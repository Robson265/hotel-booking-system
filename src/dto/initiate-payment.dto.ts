import { IsIn, IsString } from "class-validator";


export class InitiatePaymentDto{
    // @IsString()
    // bookingId!: string;

    // @IsString()
    // userId!: string;

    @IsString()
    @IsIn(['USD', 'NGN', 'GBP', 'EUR'])
    currency!: string;
}