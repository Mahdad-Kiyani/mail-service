import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";
import * as Handlebars from "handlebars";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { Configuration, SmtpConfig } from "../../config/configuration.js";
import configuration from "../../config/configuration.js";

@Injectable()
export class MultiTenantMailerService {
  private readonly logger = new Logger(MultiTenantMailerService.name);
  private readonly transporters = new Map<string, Transporter>();

  constructor(private readonly configService: ConfigService) {}

  private getSmtpConfig(appName: string): SmtpConfig {
    const config = configuration();
    return (
      config?.apps[appName] ||
      config?.defaultSmtp || {
        host: "localhost",
        port: 1025,
        secure: false,
        from: "no-reply@example.local",
      }
    );
  }

  private getOrCreateTransporter(appName: string): Transporter {
    if (this.transporters.has(appName)) {
      return this.transporters.get(appName)!;
    }

    const smtpConfig = this.getSmtpConfig(appName);
    const transporter = createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth:
        smtpConfig.user && smtpConfig.pass
          ? { user: smtpConfig.user, pass: smtpConfig.pass }
          : undefined,
    });

    this.transporters.set(appName, transporter);
    this.logger.log(
      `Created SMTP transporter for app '${appName}' (${smtpConfig.host}:${smtpConfig.port})`
    );
    return transporter;
  }

  private getTemplatePath(
    appName: string,
    templateName: string
  ): string | null {
    const templatePath = join(
      process.cwd(),
      "src",
      "templates",
      appName,
      `${templateName}.html`
    );
    return existsSync(templatePath) ? templatePath : null;
  }

  private compileTemplate(
    templatePath: string,
    context: Record<string, unknown>
  ): string {
    const templateContent = readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  async sendMail(
    to: string,
    subject: string,
    appName: string,
    templateName: string,
    context: Record<string, unknown> = {},
    from?: string
  ): Promise<void> {
    const smtpConfig = this.getSmtpConfig(appName);
    const transporter = this.getOrCreateTransporter(appName);
    const templatePath = this.getTemplatePath(appName, templateName);

    if (!templatePath) {
      throw new NotFoundException(
        `Template '${appName}/${templateName}.html' not found`
      );
    }

    try {
      const html = this.compileTemplate(templatePath, context);
      await transporter.sendMail({
        from: from || smtpConfig.from,
        to,
        subject,
        html,
      });
      this.logger.log(
        `Email sent successfully to ${to} via ${smtpConfig.host}`
      );
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  getConfiguredApps(): string[] {
    const config = configuration();
    return Object.keys(config?.apps || {});
  }

  getAppSmtpConfig(appName: string): SmtpConfig | null {
    const config = configuration();
    console.log("config", config);
    return config?.apps[appName] || null;
  }
}
