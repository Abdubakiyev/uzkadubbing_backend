import { PartialType } from '@nestjs/swagger';
import { CreateUserSubscriptionDto } from './create-user-subscription.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSubscriptionDto extends PartialType(CreateUserSubscriptionDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
