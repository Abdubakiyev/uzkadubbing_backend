import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/core/Guard/roles.guard';
import { Roles } from 'src/core/Guard/roles.decorator';
import { JwtAuthGuard } from 'src/core/Guard/JwtGuard';

@ApiTags('Subscription Plans')        // Swagger panelida guruh nomi
@ApiBearerAuth('JWT-auth')            // JWT Authorization
@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(private readonly service: SubscriptionPlanService) {}

  // 🔹 CREATE – faqat ADMIN
  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateSubscriptionPlanDto) {
    return this.service.create(dto);
  }

  // 🔹 GET ALL – barcha userlar ko‘ra oladi
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔹 GET ONE – barcha userlar ko‘ra oladi
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 🔹 UPDATE – faqat ADMIN
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionPlanDto) {
    return this.service.update(id, dto);
  }

  // 🔹 DELETE – faqat ADMIN
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
