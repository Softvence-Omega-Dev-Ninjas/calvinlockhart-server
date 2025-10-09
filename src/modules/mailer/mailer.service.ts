import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use STARTTLS, not SSL
      auth: {
        user: this.config.getOrThrow("SMTP_USER"),
        pass: this.config.getOrThrow("SMTP_PASS"),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    try {
      return await this.transporter.sendMail({
        from: `"Verify Email" <${this.config.getOrThrow("SMTP_USER")}>`,
        to: email,
        subject: "Email Verification Code",
        html: `<p>Your verification code: <b>${code}</b></p>`,
      });
    } catch (err) {
      console.error("Error sending verification email:", err);
      throw new InternalServerErrorException(
        `Failed to send verification email: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async sendPasswordResetEmail(email: string, code: string) {
    try {
      return await this.transporter.sendMail({
        from: `"Reset Password" <${this.config.getOrThrow("SMTP_USER")}>`,
        to: email,
        subject: "Password Reset Code",
        html: `<p>Your password reset code: <b>${code}</b></p>`,
      });
    } catch (err) {
      console.error("Error sending password reset email:", err);
      throw new InternalServerErrorException(
        `Failed to send password reset email: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
