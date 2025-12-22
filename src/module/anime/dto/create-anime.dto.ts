import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnimeDto {
  @ApiProperty({
    description: 'Animening nomi',
    example: 'Naruto Shippuden',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Slug — URL uchun unikal identifikator',
    example: 'naruto-shippuden',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Anime uchun asosiy rasm URL manzili',
    example: 'https://example.com/anime/naruto.jpg',
  })
  @IsString()
  image: string;

  @ApiPropertyOptional({
    description: 'Anime pullikmi yoki bepulmi',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean = false;

  @ApiProperty({
    description: 'Anime videosi yoki asosiy media URL',
    example: 'https://cdn.example.com/anime/naruto/full-video.mp4',
  })
  @IsString()
  url: string; 
}
