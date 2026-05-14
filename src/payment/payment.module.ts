import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma.module';
import { PaymentService } from './payment.service';

@Module({
    imports: [PrismaModule],
    // controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService]
})
export class PaymentModule {}
