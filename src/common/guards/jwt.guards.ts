import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedException("Missing token");
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>("JWT_SECRET"),
      });

      if (payload.reset === true || payload.type === "reset") {
        throw new UnauthorizedException(
          "Password reset token cannot be used for authentication",
        );
      }

      // attach user data to request with normalized property names
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
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
