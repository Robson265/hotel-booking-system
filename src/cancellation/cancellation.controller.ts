import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guard/roles.guards';
import { Roles } from 'src/common/roles.decorator';
import { CancelBookingDto } from 'src/dto/cancelBooking.dto';
import { CancellationService } from './cancellation.service';

@Controller('cancellation')
export class CancellationController {
      constructor(private readonly cancellationService: CancellationService) {}

  // Customer cancels their own booking
      @Post(':bookingId/cancel')
      @HttpCode(HttpStatus.OK)
      async cancelByCustomer(
        @Param('bookingId') bookingId: string,
        @Body() dto: CancelBookingDto,
        @Req() req: any,
      ) {
          const result = await this.cancellationService.cancelByCustomer(
          bookingId,
          req.user.id,
          );
          return {
                  message: 'Booking cancelled successfully',
                  refundPercentage: result.refundPercentage,
          };
        } 

  // Hotel Admin cancels on behalf of hotel (BR-35 — always full refund)
      @Post(':bookingId/admin-cancel')
      @UseGuards(RolesGuard)
      @Roles('HOTEL_ADMIN', 'SUPER_ADMIN')
      @HttpCode(HttpStatus.OK)
      async cancelByAdmin(@Param('bookingId') bookingId: string, userId: string) {
        await this.cancellationService.cancelByAdmin(bookingId, userId);
        return {
                message: 'Booking cancelled by admin. Full refund issued.',
              };
      }

      
}

