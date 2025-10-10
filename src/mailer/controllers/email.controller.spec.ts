import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { EmailService } from "../services/email.service";

describe("EmailController", () => {
  let app: INestApplication;
  let emailService: { sendMail: jest.Mock };

  beforeEach(async () => {
    emailService = { sendMail: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [{ provide: EmailService, useValue: emailService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("sendEmail should delegate to service and return accepted", async () => {
    const controller = app.get(EmailController);
    const dto = {
      to: "user@example.com",
      subject: "Welcome",
      app: "app1",
      template: "welcome",
      context: { name: "Jane" },
    } as any;

    const res = await controller.sendEmail(dto);
    expect(res).toEqual({ status: "accepted" });
    expect(emailService.sendMail).toHaveBeenCalledWith(
      "user@example.com",
      "Welcome",
      "app1",
      "welcome",
      { name: "Jane" }
    );
  });
});

