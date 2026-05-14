import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto{

    @IsInt()
    @Min(1)
    @Max(5)
    cleanlinessRating!:  string;

    @IsInt()
    @Min(1)
    @Max(5)
    serviceRating!: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating!: string;

    @IsString()
    @IsOptional()
    comment!: string;
}