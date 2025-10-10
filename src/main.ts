import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { createServer } from "node:net";
import type { AddressInfo } from "node:net";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Structured logging with pino
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = app.get(ConfigService);
  const configuredPort =
    Number(process.env.PORT) || Number(config.get("http.port")) || 3000;

  // OpenAPI/Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Mail Service API")
    .setDescription("Email microservice API documentation")
    .setVersion("1.0")
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("/docs", app, openApiDocument);

  async function findAvailablePort(
    preferredPort: number,
    maxAttempts = 10
  ): Promise<number> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const portToTry = preferredPort + attempt;
      const isFree = await new Promise<boolean>((resolve) => {
        const tester = createServer()
          .once("error", () => resolve(false))
          .once("listening", () => tester.close(() => resolve(true)))
          .listen(portToTry, "0.0.0.0");
      });
      if (isFree) return portToTry;
    }
    return 0; // let the OS choose
  }

  const chosenPort = await findAvailablePort(configuredPort);
  await app.listen(chosenPort, "0.0.0.0");
  const address = app.getHttpServer().address() as AddressInfo | string;
  const actualPort = typeof address === "string" ? chosenPort : address.port;
  logger.log(`Email service running on port ${actualPort}`);
}

bootstrap();
