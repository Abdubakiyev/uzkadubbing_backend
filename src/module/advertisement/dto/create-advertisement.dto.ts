import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAdvertisementDto {
  @ApiPropertyOptional({
    description: 'Reklama videosi URL yoki file path',
    example: 'http://localhost:3000/uploads/ads-videos/video.mp4',
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({
    description: 'Reklama matni',
    example: 'Uzka Dubbing — yangi loyihamiz!',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'Reklama bosilganda o‘tiladigan link',
    example: 'https://uzkadubbing.uz',
  })
  @IsOptional()
  @IsString()
  link?: string;
}
