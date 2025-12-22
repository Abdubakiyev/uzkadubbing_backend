import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';

import { MailModule } from './core/mail/mail.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { SubscriptionPlanModule } from './module/subscription-plan/subscription-plan.module';
import { AnimeModule } from './module/anime/anime.module';
import { EpisodeModule } from './module/episode/episode.module';
import { CommentModule } from './module/comment/comment.module';
import { UserSubscriptionModule } from './module/user-subscription/user-subscription.module';
import { AdvertisementModule } from './module/advertisement/advertisement.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    UserModule,
    AuthModule,
    SubscriptionPlanModule,
    AnimeModule,
    EpisodeModule,
    CommentModule,
    UserSubscriptionModule,
    AdvertisementModule
  ],
  controllers: [AppController],
})
export class AppModule {}
