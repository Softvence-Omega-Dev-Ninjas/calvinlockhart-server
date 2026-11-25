import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtResetGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedException("Missing reset token");
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>("JWT_SECRET"),
      });

      if (!payload.reset && payload.type !== "reset") {
        throw new UnauthorizedException(
          "Invalid reset token. An authentication access token cannot be used here.",
        );
      }

      request.user = {
        ...payload,
        sub: payload.sub || payload.userId,
        userId: payload.sub || payload.userId,
      };
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException("Invalid or expired reset token");
    }
  }
}
