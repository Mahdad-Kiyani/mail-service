import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { EmailService } from "../services/email.service.js";
import { SendEmailDto } from "../dto/send-email.dto.js";
import {
  ApiAcceptedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Email")
@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("send-email")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary:
      "Send an email using a template with app-specific SMTP configuration",
  })
  @ApiAcceptedResponse({ description: "Email accepted for processing" })
  async sendEmail(@Body() dto: SendEmailDto) {
    await this.emailService.sendMail(
      dto.to,
      dto.subject,
      dto.app,
      dto.template,
      dto.context ?? {},
      dto.from
    );
    return { status: "accepted" };
  }

  @Get("apps")
  @ApiOperation({ summary: "Get list of configured apps" })
  @ApiResponse({ status: 200, description: "List of configured apps" })
  async getConfiguredApps() {
    return { apps: this.emailService.getConfiguredApps() };
  }

  @Get("apps/:appName/config")
  @ApiOperation({ summary: "Get SMTP configuration for a specific app" })
  @ApiParam({ name: "appName", description: "App name" })
  @ApiResponse({ status: 200, description: "SMTP configuration for the app" })
  @ApiResponse({ status: 404, description: "App not found" })
  async getAppConfig(@Param("appName") appName: string) {
    const config = this.emailService.getAppSmtpConfig(appName);
    if (!config) {
      return { error: "App not found", appName };
    }
    return {
      host: config.host,
      port: config.port,
      secure: config.secure,
      from: config.from,
      hasAuth: !!(config.user && config.pass),
    };
  }
}
