// src/auth/dto/resend.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendDto {
  @ApiProperty({
    description: 'Foydalanuvchining email manzili, tasdiqlash kodi shu emailga yuboriladi',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email noto‘g‘ri formatda bo‘lmasligi kerak' })
  email: string;
}
