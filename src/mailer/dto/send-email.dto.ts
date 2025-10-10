import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendEmailDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  to!: string;

  @ApiProperty({ example: "Welcome!" })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({
    example: "app1",
    description: "App name for SMTP configuration",
  })
  @IsString()
  @IsNotEmpty()
  app!: string;

  @ApiProperty({ example: "welcome", description: "Template name" })
  @IsString()
  @IsNotEmpty()
  template!: string;

  @ApiProperty({
    required: false,
    example: { name: "John" },
    description: "Template variables",
  })
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;

  @ApiProperty({
    required: false,
    example: "sender@example.com",
    description: "Sender email address (overrides app SMTP config)",
  })
  @IsOptional()
  @IsEmail()
  from?: string;
}
