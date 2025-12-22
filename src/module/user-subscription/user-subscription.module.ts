import { Module } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscriptionController } from './user-subscription.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';


@Module({
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService, PrismaService],
})
export class UserSubscriptionModule {}
