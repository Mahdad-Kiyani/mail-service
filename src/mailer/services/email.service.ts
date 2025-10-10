import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { MultiTenantMailerService } from "./multi-tenant-mailer.service.js";

@Injectable()
export class EmailService {
  constructor(
    private readonly multiTenantMailer: MultiTenantMailerService,
    private readonly logger: Logger
  ) {}

  async sendMail(
    to: string,
    subject: string,
    app: string,
    template: string,
    context: Record<string, unknown>,
    from?: string
  ) {
    this.logger.log(`Sending email to ${to} for app ${app}`);
    await this.multiTenantMailer.sendMail(
      to,
      subject,
      app,
      template,
      context,
      from
    );
  }

  getConfiguredApps(): string[] {
    return this.multiTenantMailer.getConfiguredApps();
  }

  getAppSmtpConfig(appName: string) {
    return this.multiTenantMailer.getAppSmtpConfig(appName);
  }
}
