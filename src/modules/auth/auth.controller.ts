import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SendOtpDto } from "./dto/send-otp";
import { VerificationType } from "@prisma/client";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { VerifyOtpDto } from "./dto/verify-otp";
import { JwtAuthGuard } from "src/common/guards/jwt.guards";
import { JwtResetGuard } from "src/common/guards/jwt-reset.guard";
import { ForgetSendOtpDto } from "./dto/forget-send.otp";
import { ForgetVerifyOtpDto } from "./dto/forget-verify-otp";
import { SetPasswordDto } from "./dto/set-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  @ApiOperation({ summary: "Register new user" })
  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto.email, dto.password, dto.confirmPassword);
  }

  @ApiOperation({ summary: "Login user" })
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post("send-code")
  @ApiOperation({ summary: "Send email verification or password reset code" })
  async sendCode(@Body() dto: SendOtpDto) {
    return this.auth.sendOtpForType(dto.email, dto.type);
  }

  @ApiOperation({ summary: "Verify OTP code" })
  @Post("verify-code")
  async verifyCode(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.email, dto.code, dto.type);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post("reset-password")
  @ApiOperation({ summary: "Change password (for logged in user)" })
  async resetPassword(@Body() dto: SetPasswordDto, @Request() req) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    const userId = req.user.userId || req.user.sub;
    await this.auth.resetPassword(userId, dto.oldPassword, dto.newPassword);
    return { message: "Password updated successfully" };
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Request forgot password OTP" })
  async forgotPassword(@Body() dto: ForgetSendOtpDto) {
    return this.auth.sendOtpForType(dto.email, VerificationType.PASSWORD_RESET);
  }

  @Post("verify-forget-code")
  @ApiOperation({ summary: "Verify OTP code for forgot password" })
  async verifyResetCode(@Body() dto: ForgetVerifyOtpDto) {
    return this.auth.verifyOtp(
      dto.email,
      dto.code,
      VerificationType.PASSWORD_RESET,
    );
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtResetGuard)
  @Post("set-new-password")
  @ApiOperation({ summary: "Set new password using reset token" })
  async setNewPassword(@Body() dto: ResetPasswordDto, @Request() req) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    const userId = req.user.userId || req.user.sub;
    await this.auth.setPassword(userId, dto.newPassword);
    return { message: "Password successfully updated" };
  }
}
