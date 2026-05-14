import { Module } from '@nestjs/common';
import { CancellationService } from './cancellation.service';
import { CancellationController } from './cancellation.controller';
import { PrismaModule } from 'src/config/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CancellationService],
  controllers: [CancellationController],
  exports: [CancellationService]
})
export class CancellationModule {}
