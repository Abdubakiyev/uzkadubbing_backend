import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Foydalanuvchi email manzili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
    description: 'Foydalanuvchi paroli (kamida 6 belgi)',
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;

  @ApiPropertyOptional({
    example: UserRole.USER,
    enum: UserRole,
    description: 'Foydalanuvchi roli (default: USER)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
