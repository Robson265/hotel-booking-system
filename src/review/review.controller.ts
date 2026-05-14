import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

  // Customer submits review for a COMPLETED booking (BR-43, BR-44, BR-45)
  @Post('booking/:bookingId')
  @HttpCode(HttpStatus.CREATED)
  async submitReview(
    @Param('bookingId') bookingId: string, userId: string, hotelId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    return this.reviewService.submitReview(
      bookingId,
      userId,
      hotelId,
      createReviewDto
    );
  }

  // // BR-46: Hotel Admin flags a review (cannot modify/delete content)
  // @Patch(':reviewId/flag')
  // @UseGuards(RolesGuard)
  // @Roles('HOTEL_ADMIN', 'SUPER_ADMIN')
  // @HttpCode(HttpStatus.OK)
  // async flagReview(@Param('reviewId') reviewId: string) {
  //   await this.reviewService.flagReview(reviewId);
  //   return { message: 'Review flagged for Super Admin attention' };
  // }

  // // Super Admin or Hotel Admin approves review (BR-45, BR-47)
  // @Patch(':reviewId/approve')
  // @UseGuards(RolesGuard)
  // @Roles('HOTEL_ADMIN', 'SUPER_ADMIN')
  // @HttpCode(HttpStatus.OK)
  // async approveReview(@Param('reviewId') reviewId: string) {
  //   await this.reviewService.approveReview(reviewId);
  //   return { message: 'Review approved and hotel rating updated' };
  // }
}

