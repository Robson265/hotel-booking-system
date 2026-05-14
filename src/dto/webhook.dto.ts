import { IsString } from "class-validator";


export class WebhookDto{

    @IsString()
    bookingId!: string;

    @IsString()
    status!: string;
}