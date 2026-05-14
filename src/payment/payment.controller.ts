// import { Body, Controller, HttpCode, HttpStatus, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
// import { InitiatePaymentDto } from 'src/dto/initiate-payment.dto';
// import { PaymentService } from './payment.service';

// @Controller('payment')
// export class PaymentController {
//     constructor(private readonly paymentService: PaymentService) {}

//   // Customer initiates payment for a booking
//   @Post('initiate')
//   @UseGuards(JwtAuthGuard)
//   @HttpCode(HttpStatus.CREATED)
//   async initiatePayment(@Body() dto: InitiatePaymentDto) {
//     const payment = await this.paymentService.initiatePayment(
//       dto.bookingId,
//       dto.currency,
//     );
//     return {
//       message: 'Payment initiated. Complete within 15 minutes.',
//       paymentId: payment.id,
//       expiresAt: payment.expiresAt,
//       amount: payment.amount,
//       currency: payment.currency,
//     };
//   }

//   // BR-42: Stripe/Paystack webhook — no JWT guard, uses signature verification
//   @Post('webhook')
//   @HttpCode(HttpStatus.OK)
//   async handleWebhook(
//     @Req() req: RawBodyRequest<Request>,
//     @Headers('x-paystack-signature') paystackSig: string,
//     @Headers('stripe-signature') stripeSig: string,
//   ) {
//     const signature = paystackSig || stripeSig;
//     const rawBody = req.rawBody?.toString() ?? '';
//     const secret = process.env.PAYMENT_WEBHOOK_SECRET!;

//     await this.paymentService.handleWebhook(rawBody, signature, secret);
//     return { received: true };
//   }
// }


