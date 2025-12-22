import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Req,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { AdvertisementService } from './advertisement.service';
  import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
  import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
  import { JwtAuthGuard } from 'src/core/Guard/JwtGuard';
  import { RolesGuard } from 'src/core/Guard/roles.guard';
  import { UserRole } from '@prisma/client';
  import { Roles } from 'src/core/Guard/roles.decorator';
  
  @ApiTags('Advertisements')
  @ApiBearerAuth()
  @Controller('advertisements')
  export class AdvertisementController {
    constructor(private readonly advertisementService: AdvertisementService) {}
  
    // =================== CREATE ===================
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Reklama qo‘shish (Admin)' })
    create(@Body() dto: CreateAdvertisementDto) {
      return this.advertisementService.create(dto);
    }
  
    // =================== GET ALL ===================
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Barcha reklamalar' })
    findAll() {
      return this.advertisementService.findAll();
    }
  
    // =================== GET ONE ===================
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Bitta reklamani olish (Admin)' })
    findOne(@Param('id') id: string) {
      return this.advertisementService.findOne(id);
    }
  
    // =================== UPDATE ===================
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Reklamani yangilash (Admin)' })
    update(@Param('id') id: string, @Body() dto: UpdateAdvertisementDto) {
      return this.advertisementService.update(id, dto);
    }
  
    // =================== DELETE ===================
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Reklamani o‘chirish (Admin)' })
    remove(@Param('id') id: string) {
      return this.advertisementService.remove(id);
    }
  
    // =================== UPLOAD VIDEO ===================
    @Post('upload-video')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload video for advertisement (Admin)' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary', description: 'Advertisement video file' },
        },
        required: ['file'],
      },
    })
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/ads-videos',
          filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = file.originalname.split('.').pop();
            cb(null, `${unique}.${ext}`);
          },
        }),
      }),
    )
    uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
      // 🔹 Debug: token headerni tekshirish
      console.log('Authorization header:', req.headers['authorization']); // Swagger yoki frontend orqali kelayotgan token
  
      if (!file) {
        throw new BadRequestException('File is required');
      }
  
      const url = `https://uzkadubbing.onrender.com/uploads/ads-videos/${file.filename}`;
      return { url };
    }
  }
  