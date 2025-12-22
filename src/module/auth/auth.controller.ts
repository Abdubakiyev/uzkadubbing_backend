import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResendDto } from './dto/resend.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 🔹 Register user
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Registration successful, verification code sent to email' })
  @ApiResponse({ status: 400, description: 'Email already registered' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.role);
  }

  // 🔹 Verify code (OTP)
  @Post('verify')
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiResponse({ status: 200, description: 'User verified and tokens returned' })
  @ApiResponse({ status: 400, description: 'Invalid code or expired' })
  @ApiBody({ type: VerifyDto })
  async verify(@Body() dto: VerifyDto) {
    return this.authService.verifyCode(dto.email, dto.code);
  }

  // 🔹 Resend verification code
  @Post('resend')
  @ApiOperation({ summary: 'Resend verification code to email' })
  @ApiResponse({ status: 200, description: 'Verification code resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: ResendDto })
  async resend(@Body() dto: ResendDto) {
    return this.authService.resendVerificationCode(dto.email);
  }
}
