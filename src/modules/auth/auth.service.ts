import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TokenService } from "./token.service";
import { MailerService } from "../mailer/mailer.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { VerificationType } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { generateOTP } from "src/common/utils/otp.util";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private tokenService: TokenService,
    private mailer: MailerService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(email: string, password: string, confirmPassword: string) {
    const user = await this.users.createUser(email, password, confirmPassword);
    await this.sendOtpForType(user.email, VerificationType.EMAIL_VERIFICATION);
    return {
      message: "User registered successfully. Please verify your email.",
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    if (user.isDeleted) throw new NotFoundException("User not found");

    // User verification with email not required in login for now
    // if (!user.isEmailVerified) {
    //   throw new UnauthorizedException(
    //     "Please verify your email address before logging in.",
    //   );
    // }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const payload = { sub: user.id, email: user.email, type: "access" };
    return { user, access_token: this.jwt.sign(payload) };
  }

  async sendOtpForType(email: string, type: VerificationType) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException("No account found with this email");
    if (user.isDeleted) throw new NotFoundException("User not found");

    const code = generateOTP(6);
    await this.tokenService.createToken(
      user.id,
      code,
      type,
      Number(this.config.get("OTP_EXPIRES_MINUTES") || 5),
    );

    if (type === VerificationType.PASSWORD_RESET) {
      this.mailer.sendPasswordResetEmail(email, code).catch((err) => {
        console.error("Background password reset email dispatch failed:", err);
      });
    } else {
      this.mailer.sendVerificationEmail(email, code).catch((err) => {
        console.error("Background verification email dispatch failed:", err);
      });
    }
    return { message: "Verification code sent successfully" };
  }

  async verifyOtp(email: string, code: string, type: VerificationType) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException("No account found with this email");
    if (user.isDeleted) throw new NotFoundException("User not found");

    await this.tokenService.consumeValidTokenForUser(user.id, code, type);

    if (type === VerificationType.EMAIL_VERIFICATION) {
      await this.users.setEmailVerified(user.id);
      return { message: "Email verified successfully" };
    } else if (type === VerificationType.PASSWORD_RESET) {
      // Proving ownership of email via OTP also verifies email
      if (!user.isEmailVerified) {
        await this.users.setEmailVerified(user.id);
      }
      const expiresIn = Number(
        this.config.get("RESET_TOKEN_EXPIRES_SECONDS") || 900,
      );
      const token = this.jwt.sign(
        { sub: user.id, email: user.email, reset: true, type: "reset" },
        { expiresIn },
      );
      return { resetToken: token };
    }
    return { message: "OK" };
  }

  // Logged-in password reset (with old password)
  async resetPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Unauthorized Access");
    }

    if (user.isDeleted) throw new NotFoundException("User not found");

    if (!user.isEmailVerified) {
      throw new UnauthorizedException("Please verify your email address.");
    }

    return this.users.updatePassword(userId, oldPassword, newPassword);
  }

  // Forgot password new password set (with reset token)
  async setPassword(userId: string, newPassword: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Unauthorized Access");
    }

    if (user.isDeleted) throw new NotFoundException("User not found");

    return this.users.forgetUpdatePassword(userId, newPassword);
  }
}
