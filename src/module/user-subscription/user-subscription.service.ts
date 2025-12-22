import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class UserSubscriptionService {
  constructor(private prisma: PrismaService) {}

  // CREATE – yangi subscription qo'shish
  async create(dto: CreateUserSubscriptionDto) {
    return this.prisma.userSubscription.create({
      data: {
        userId: dto.userId,
        planId: dto.planId,
        expiresAt: new Date(dto.expiresAt),
      },
      include: { user: true, plan: true },
    });
  }

  // FIND ALL – hamma user subscriptionlarini planlari bilan olish
  async findAll() {
    return this.prisma.userSubscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, plan: true }, // har bir subscriptionning user va plan ma'lumotlarini qo'shish
    });
  }

  // FIND ONE – bitta subscription olish
  async findOne(id: string) {
    const item = await this.prisma.userSubscription.findUnique({
      where: { id },
      include: { user: true, plan: true },
    });

    if (!item) throw new NotFoundException('User subscription not found');

    return item;
  }

  // UPDATE – subscription yangilash
  async update(id: string, dto: UpdateUserSubscriptionDto) {
    await this.findOne(id);

    return this.prisma.userSubscription.update({
      where: { id },
      data: {
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
      include: { user: true, plan: true },
    });
  }

  // DELETE – subscription o'chirish
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.userSubscription.delete({
      where: { id },
    });
  }
}
