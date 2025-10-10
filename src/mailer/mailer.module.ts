import { Module } from "@nestjs/common";
import { EmailService } from "./services/email.service.js";
import { EmailController } from "./controllers/email.controller.js";
import { MultiTenantMailerService } from "./services/multi-tenant-mailer.service.js";

@Module({
  controllers: [EmailController],
  providers: [EmailService, MultiTenantMailerService],
  exports: [EmailService, MultiTenantMailerService],
})
export class MailerModule {}
