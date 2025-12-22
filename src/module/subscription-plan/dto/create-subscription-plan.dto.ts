import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    example: 'Premium Plan',
    description: 'Tarif nomi',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 50000,
    description: 'Tarif narxi (so‘m)',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 1,
    description: 'Tarif muddati (oyda)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({
    example: 'Barcha anime videolariga cheksiz kirish',
    description: 'Tarif tavsifi (ixtiyoriy)',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
