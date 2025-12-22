import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Foydalanuvchining email manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Emailga yuborilgan 6 xonali tasdiqlash kodi',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  @Length(6, 6, { message: 'Kod 6 raqamli bo‘lishi kerak' })
  code: string;
}
