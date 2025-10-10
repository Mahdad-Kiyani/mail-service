import { NotFoundException } from "@nestjs/common";
import { EmailService } from "./email.service";
import { MultiTenantMailerService } from "./multi-tenant-mailer.service";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
}));

describe("EmailService", () => {
  let service: EmailService;
  let multiTenantMailer: jest.Mocked<MultiTenantMailerService>;
  let logger: { log: jest.Mock; error: jest.Mock };

  const existsSync = require("node:fs").existsSync as jest.Mock;

  beforeEach(() => {
    multiTenantMailer = {
      sendMail: jest.fn(),
      getConfiguredApps: jest.fn(),
      getAppSmtpConfig: jest.fn(),
    } as any;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    };
    service = new EmailService(multiTenantMailer, logger as any);
    existsSync.mockReset();
  });

  it("should send email when template exists", async () => {
    await service.sendMail("user@example.com", "Welcome", "app1", "welcome", {
      name: "Jane",
    });

    expect(multiTenantMailer.sendMail).toHaveBeenCalledWith(
      "user@example.com",
      "Welcome",
      "app1",
      "welcome",
      { name: "Jane" }
    );
    expect(logger.log).toHaveBeenCalled();
  });

  it("should throw NotFoundException when template is missing", async () => {
    multiTenantMailer.sendMail.mockRejectedValueOnce(
      new NotFoundException("Template not found")
    );

    await expect(
      service.sendMail("u@e.com", "Subj", "appX", "missing", {})
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(multiTenantMailer.sendMail).toHaveBeenCalled();
  });

  it("should log and rethrow if mailer fails", async () => {
    const boom = new Error("smtp down");
    multiTenantMailer.sendMail.mockRejectedValueOnce(boom);

    await expect(
      service.sendMail("u@e.com", "Subj", "app1", "welcome", {})
    ).rejects.toBe(boom);
    expect(multiTenantMailer.sendMail).toHaveBeenCalled();
  });
});
