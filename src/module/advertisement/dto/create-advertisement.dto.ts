import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdvertisementDto {
  @ApiProperty({
    description: 'Reklama qaysi episodega tegishli ekanligi',
    example: 'b3a8f6b1-9d2e-4d5f-9f8a-8b8f6c1c2d34',
  })
  @IsUUID()
  episodeId: string;

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
