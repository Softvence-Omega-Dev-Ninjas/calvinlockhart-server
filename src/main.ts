import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const logger = new Logger("Bootstrap");

  const config = new DocumentBuilder()
    .setTitle("Calvin Lockhart API")
    .setDescription(
      `### Backend API Documentation
Welcome to the official REST API documentation for the **Calvin Lockhart Server**.

#### Key Features:
- **Authentication**: JWT-based auth, 6-digit email OTP verification, password reset, and token guards.
- **User Management**: Profile updates, Cloudinary avatar upload, account deletion.
- **Topics & Precepts**: Precept topics, lesson topics, favorite topics, and precept verse grouping.
- **Notes**: Personal study notes attached to precepts with full BOLA authorization guards.
- **Bible Data Services**: Multi-translation Bible search and chapter retrieval (KJV, KJVA, KJVCP, Spanish, Strong's).`,
    )
    .setVersion("1.0.0")
    .addTag(
      "Auth",
      "Authentication, registration, email verification, and password reset endpoints",
    )
    .addTag(
      "Users",
      "User profile operations, avatar upload, and account management",
    )
    .addTag(
      "Topics",
      "Bible study topic management, precept linking, and filtering",
    )
    .addTag(
      "Notes",
      "Personal precept notes creation, modification, and deletion",
    )
    .addTag(
      "Bibles",
      "Public Bible translations, chapters, and verse lookup services",
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token (obtained via `/auth/login`)",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customCss = `
    .swagger-ui { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; background-color: #ffffff; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .request-duration { display: none !important; }
    .swagger-ui .info { margin: 20px 0 30px 0; padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
    .swagger-ui .info .title { color: #0f172a; font-size: 28px; font-weight: 700; font-family: 'Inter', sans-serif; }
    .swagger-ui .info p, .swagger-ui .info li { font-size: 14px; line-height: 1.6; color: #334155; }
    .swagger-ui .scheme-container { background: #ffffff; border-bottom: 1px solid #e2e8f0; box-shadow: none; padding: 16px 0; }
    .swagger-ui .opblock-tag { font-size: 18px; font-weight: 600; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding: 12px 0; }
    .swagger-ui .opblock { border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 12px; border: 1px solid #e2e8f0; background: #ffffff; }
    .swagger-ui .opblock .opblock-summary { padding: 10px 16px; background: #ffffff; }
    .swagger-ui .opblock-summary-method { border-radius: 6px; font-weight: 700; font-size: 12px; min-width: 70px; text-align: center; }
    .swagger-ui .opblock.opblock-post { background: #f0fdf4; border-color: #bbf7d0; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #16a34a; }
    .swagger-ui .opblock.opblock-get { background: #eff6ff; border-color: #bfdbfe; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #2563eb; }
    .swagger-ui .opblock.opblock-put { background: #fffbeb; border-color: #fde68a; }
    .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #d97706; }
    .swagger-ui .opblock.opblock-patch { background: #faf5ff; border-color: #e9d5ff; }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #7c3aed; }
    .swagger-ui .opblock.opblock-delete { background: #fef2f2; border-color: #fecaca; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626; }
    .swagger-ui .btn.authorize { background: #2563eb; color: #ffffff; border-radius: 6px; border: none; font-weight: 600; }
    .swagger-ui .btn.authorize svg { fill: #ffffff; }
    .swagger-ui section.models { border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; }
  `;

  SwaggerModule.setup("api/docs", app, document, {
    customCss,
    customSiteTitle: "Calvin Lockhart API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: false,
      docExpansion: "list",
      filter: true,
      defaultModelsExpandDepth: 1,
    },
  });

  await app.listen(process.env.PORT || 5000, () => {
    logger.log(`Server started on port ${process.env.PORT || 5000}`);
  });
}
bootstrap();
