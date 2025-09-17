import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: '"MyApp" <no-reply@myapp.com>',
        to: email,
        subject: 'Email Verification Code',
        html: `<p>Your verification code: <b>${code}</b></p>`,
      });
    } catch (err) {
      console.log(err)
    }
  }

  async sendPasswordResetEmail(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: '"MyApp" <no-reply@myapp.com>',
        to: email,
        subject: 'Password Reset Code',
        html: `<p>Your password reset code: <b>${code}</b></p>`,
      });
    } catch (err) {
      console.log(err)
    }
  }
}
