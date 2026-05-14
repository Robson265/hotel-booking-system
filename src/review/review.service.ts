import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/config/prisma.service';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { BookingStatus } from 'src/generated/prisma/enums';

@Injectable()
export class ReviewService {

      constructor(private prisma: PrismaService) {}

  async submitReview(bookingId: string, userId: string, hotelId: string,  createReviewDto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();

    // BR-43: only COMPLETED bookings can be reviewed
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ForbiddenException('Can only review completed bookings');
    }

    // BR-44: one review per booking — Prisma unique constraint + HTTP 409
    if (booking.review) {
      throw new ConflictException('Review already submitted for this booking'); // HTTP 409
    }

    // BR-45: isApproved defaults to false
    return this.prisma.review.create({
      data: { bookingId,
              rating: createReviewDto.rating, 
              comment: createReviewDto.comment,
              cleanlinessRating: createReviewDto.cleanlinessRating,
              serviceRating: createReviewDto.serviceRating,
              isApproved: false,
              userId,
              hotelId
             },
    });
  }

  // BR-46: Hotel Admin can flag but NOT modify/delete
  // async flagReview(reviewId: string) {
  //   return this.prisma.review.update({
  //     where: { id: reviewId },
  //     data: { isFlagged: true },
  //   });
  // }

  // Super Admin or Hotel Admin approves review
  // async approveReview(reviewId: string) {
  //   const review = await this.prisma.review.update({
  //     where: { id: reviewId },
  //     data: { isApproved: true },
  //     include: { booking: { select: { hotelId: true } } },
  //   });

  //   // BR-47: recompute hotel averageRating asynchronously after approval
  //   setImmediate(() => this.recomputeHotelRating(review.booking.hotelId));

  //   return review;
  // }

  // private async recomputeHotelRating(hotelId: string) {
  //   const result = await this.prisma.review.aggregate({
  //     where: {
  //       isApproved: true,
  //       booking: { hotelId },
  //     },
  //     _avg: { rating: true },
  //   });

  //   await this.prisma.hotel.update({
  //     where: { id: hotelId },
  //     data: { averageRating: result._avg.rating ?? 0 },
  //   });
  // }
}


