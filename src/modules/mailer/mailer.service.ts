import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>("SMTP_HOST") || "smtp.gmail.com";
    const port = Number(this.config.get<number>("SMTP_PORT") || 587);
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      pool: true, // Reuse SMTP connection pool to prevent per-request connection overhead
      maxConnections: 5,
      maxMessages: 100,
      connectionTimeout: 10000, // 10s connection timeout
      greetingTimeout: 5000, // 5s greeting timeout
      socketTimeout: 10000, // 10s socket timeout
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
        from: `"Calvin Lockhart" <${this.config.getOrThrow("SMTP_USER")}>`,
        to: email,
        subject: "Email Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333333; text-align: center;">Verify Your Email</h2>
            <p style="color: #666666; font-size: 16px;">Thank you for registering. Please use the verification code below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4A90E2; background-color: #F0F4F8; padding: 12px 24px; border-radius: 6px; display: inline-block;">${code}</span>
            </div>
            <p style="color: #999999; font-size: 14px;">This code is valid for 5 minutes. If you did not request this email, please ignore it.</p>
          </div>
        `,
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
        from: `"Calvin Lockhart" <${this.config.getOrThrow("SMTP_USER")}>`,
        to: email,
        subject: "Password Reset Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
            <p style="color: #666666; font-size: 16px;">We received a request to reset your password. Use the code below to proceed with resetting your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #E74C3C; background-color: #FDEDEC; padding: 12px 24px; border-radius: 6px; display: inline-block;">${code}</span>
            </div>
            <p style="color: #999999; font-size: 14px;">This code is valid for 5 minutes. If you did not request a password reset, your account is safe and you can ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Error sending password reset email:", err);
      throw new InternalServerErrorException(
        `Failed to send password reset email: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
