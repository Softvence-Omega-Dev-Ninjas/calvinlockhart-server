import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SendOtpDto } from './dto/send-otp';
import { VerificationType } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp';
import { JwtAuthGuard } from 'src/common/guards/jwt.guards';
import { ForgetSendOtpDto } from './dto/forget-send.otp';
import { ForgetVerifyOtpDto } from './dto/forget-verify-otp';
import { setPasswordDto } from './dto/set-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  @ApiOperation({ summary: "Register new user"})
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.auth.signup(
      dto.email,
      dto.password,
      dto.confirmPassword,
   
    );
  }

  @ApiOperation({ summary: "Login  User" })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  
  @Post('send-code')
  @ApiOperation({ summary: 'Send email verify code.' })
  async sendCode(@Body() dto: SendOtpDto) {
    const type = VerificationType[dto.type];
    return this.auth.sendOtpForType(dto.email, type);
  }

   @ApiOperation({ summary: 'Verify code.' })
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyOtpDto) {
    const type = VerificationType[dto.type];
    return this.auth.verifyOtp(dto.email, dto.code, type);
  }

  @ApiTags('Auth')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
   @ApiOperation({ summary: 'set new password.' })
  async resetPassword(@Body() dto: setPasswordDto, @Request() req) {
    if (dto.newPassword !== dto.confirmPassword)
      throw new UnauthorizedException('Passwords do not match');
    const userId = req.user.sub;
    await this.auth.resetPassword(userId, dto.oldPassword, dto.newPassword);
    return { message: `Password updated` };
  }

  // forget Password...
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forget Password' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgetSendOtpDto) {
    // Always use type PASSWORD_RESET
    const type = VerificationType[dto.type];
    return this.auth.sendOtpForType(dto.email, type);
  }

  @Post('verify-forget-code')
    @ApiOperation({ summary: 'Send verify code for forget password.' })
  async verifyResetCode(@Body() dto: ForgetVerifyOtpDto) {
    // Verify OTP and return short-lived reset token
    return this.auth.verifyOtp(
      dto.email,
      dto.code,
      VerificationType.PASSWORD_RESET,
    );
  }


  // forget password
  @ApiTags('Auth')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard) 
  @Post('set-new-password')
   @ApiOperation({ summary: 'set new password.' })
  async setNewPassword(@Body() dto: ResetPasswordDto, @Request() req) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    // Ensure token is a reset token
    if (!req.user.reset) {
      throw new UnauthorizedException('Invalid reset token');
    }

    await this.auth.setPassword(req.user.sub, dto.newPassword);
    return { message: 'Password successfully updated' };
  }
}
