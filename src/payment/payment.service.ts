import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { PaymentStatus, BookingStatus, Currency, PaymentMethod } from 'src/generated/prisma/enums';
import * as crypto from 'crypto';


const PAYMENT_WINDOW_MS = 15 * 60 * 1000; // BR-38: 15 minutes


@Injectable()
export class PaymentService {

    constructor(private prisma: PrismaService) {}

  async initiatePayment(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // BR-37: exactly one primary payment record per booking
    const existingPayment = booking.payment.find(
      (p) => p.status === PaymentStatus.PAID,
    );
    if (existingPayment) throw new BadRequestException('Booking already paid');

    const expiresAt = new Date(Date.now() + PAYMENT_WINDOW_MS); // BR-38

    return this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalAmount,   // BR-40: must equal totalAmount exactly
        currency: Currency.NGN,                       // BR-41: currency specified at payment time
        status: PaymentStatus.PENDING,
        method: PaymentMethod.TRANSFER,
        userId,
        expiresAt,
      },
    });
  }

  async handleWebhook(payload: string, signature: string, secret: string) {
    // BR-42: verify webhook signature before processing
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (expected !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = JSON.parse(payload);
    const { bookingId, status } = event;

    const payment = await this.prisma.payment.findFirst({
      where: { bookingId, status: PaymentStatus.PAID },
    });

    if (!payment) return; // idempotent — already processed

    // BR-38: check expiry
    if (payment.expiresAt && payment.expiresAt < new Date()) {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.UNPAID },
        }),
        this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.CANCELLED },
        }),
      ]);
      return;
    }

    if (status === 'PAID') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.PAID },
        }),
        this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.CONFIRMED },
        }),
      ]);
    } else {
      // BR-39: payment fails → stay PENDING so customer can retry
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED},
      });
      // Booking remains PENDING — customer can retry within the window
    }
  }

}


// // payment.service.ts
// import {
//   Injectable, BadRequestException, NotFoundException,
// } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { BookingStatus, PaymentStatus } from '@prisma/client';
// import * as crypto from 'crypto';

// const PAYMENT_WINDOW_MS = 15 * 60 * 1000; // BR-38: 15 minutes

