import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards
} from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/Guard/JwtGuard';
import { RolesGuard } from 'src/core/Guard/roles.guard';
import { Roles } from 'src/core/Guard/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('User Subscriptions')
@ApiBearerAuth('JWT-auth')
@Controller('user-subscriptions')
export class UserSubscriptionController {
  constructor(private readonly service: UserSubscriptionService) {}

  // CREATE – faqat ADMIN
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create user subscription (Admin)' })
  create(@Body() dto: CreateUserSubscriptionDto) {
    return this.service.create(dto);
  }

  // GET ALL – hamma subscriptionlar va ularning planlari bilan
  @Get()
  @ApiOperation({ summary: 'Get all subscriptions with user and plan info' })
  findAll() {
    return this.service.findAll();
  }

  // GET ONE
  @Get(':id')
  @ApiOperation({ summary: 'Get a single subscription' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // UPDATE – faqat ADMIN
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update subscription (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserSubscriptionDto) {
    return this.service.update(id, dto);
  }

  // DELETE – faqat ADMIN
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete subscription (Admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
