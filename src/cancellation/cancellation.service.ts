import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { connect } from 'node:http2';
import { PrismaService } from 'src/config/prisma.service';
import { PaymentStatus, BookingStatus, PaymentMethod } from 'src/generated/prisma/enums';

@Injectable()
export class CancellationService {

    constructor(private prisma: PrismaService) {}

  private getRefundPercentage(checkInDate: Date): number {
    const now = new Date();
    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilCheckIn > 7) return 1.0;    // 100% refund
    if (daysUntilCheckIn >= 3) return 0.5;   // 50% refund
    return 0;                                  
  }

  async cancelByCustomer(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: { where: { status: PaymentStatus.PAID } } },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new BadRequestException('Unauthorized');
    if (booking.status === BookingStatus.CANCELLED)
      throw new BadRequestException('Booking already cancelled');

    const refundPct = this.getRefundPercentage(booking.checkIn);
    const originalPayment = booking.payment[0];

    return this.prisma.$transaction(async (tx) => {
      // Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      // BR-36: Create refund as a new Payment record with negative amount
      if (refundPct > 0 && originalPayment) {
        const refundAmount = Number(originalPayment.amount) * refundPct * -1;
        await tx.payment.create({
          data: {
            bookingId,
            amount: refundAmount,         // negative/credit amount
            currency: originalPayment.currency,
            status: PaymentStatus.REFUNDED,
            method: PaymentMethod.TRANSFER,
            userId
          },
        });
      }

      // BR-34: Actual payment provider call goes here (Stripe/Paystack)
      // await this.paymentGateway.refund(originalPayment.gatewayId, refundAmount);

      return { refundPercentage: refundPct * 100 };
    });
  }

  // BR-35: Hotel Admin cancels on behalf of hotel → always 100% refund
  async cancelByAdmin(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: { where: { status: PaymentStatus.PAID } } },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const originalPayment = booking.payment[0];

    return this.prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      if (originalPayment) {
        await tx.payment.create({
          data: {
            bookingId,
            amount: Number(originalPayment.amount) * -1,  // full refund
            currency: originalPayment.currency,
            status: PaymentStatus.REFUNDED,
            method: PaymentMethod.TRANSFER,
            userId
          },
        });
        // TODO: send automated compensation notification (BR-35)
        // await this.notificationService.sendCompensation(booking.customerId);
      }
    });
  }
}



