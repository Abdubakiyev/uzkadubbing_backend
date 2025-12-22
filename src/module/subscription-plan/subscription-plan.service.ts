import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateSubscriptionPlanDto) {
    return this.prisma.subscriptionPlan.create({
      data: dto,
    });
  }

  // FIND ALL
  async findAll() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // FIND ONE
  async findOne(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Tarif topilmadi');
    return plan;
  }

  // UPDATE
  async update(id: string, dto: UpdateSubscriptionPlanDto) {
    const exists = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Tarif topilmadi');

    return this.prisma.subscriptionPlan.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE
  async remove(id: string) {
    const exists = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Tarif topilmadi');

    return this.prisma.subscriptionPlan.delete({ where: { id } });
  }
}
