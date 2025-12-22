import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserSubscriptionDto {
  @ApiProperty({ example: 'e4cfecb0-4f6b-4c2c-8a66-a3223aa12345' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '7b123abc-91ee-4433-b55f-af12094c1111' })
  @IsString()
  planId: string;

  @ApiProperty({ example: '2025-02-10T00:00:00.000Z' })
  @IsDateString()
  expiresAt: string;
}
