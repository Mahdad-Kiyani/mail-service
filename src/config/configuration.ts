export interface SmtpConfig {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  secure: boolean;
  from: string;
}

export interface Configuration {
  http: {
    port: number;
  };
  apps: Record<string, SmtpConfig>;
  defaultSmtp: SmtpConfig;
}

function getAppSmtpConfig(appName: string): SmtpConfig {
  const prefix = appName.toUpperCase();

  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    host: isDevelopment
      ? process.env.SMTP_HOST || "localhost"
      : process.env[`${prefix}_SMTP_HOST`] ||
        process.env.SMTP_HOST ||
        "localhost",
    port: Number(
      isDevelopment
        ? process.env.SMTP_PORT || 1025
        : process.env[`${prefix}_SMTP_PORT`] || process.env.SMTP_PORT || 1025
    ),
    user: isDevelopment
      ? undefined
      : process.env[`${prefix}_SMTP_USER`] || process.env.SMTP_USER,
    pass: isDevelopment
      ? undefined
      : process.env[`${prefix}_SMTP_PASS`] || process.env.SMTP_PASS,
    secure:
      process.env[`${prefix}_SMTP_SECURE`] === "true" ||
      process.env.SMTP_SECURE === "true",
    from: isDevelopment
      ? process.env.SMTP_FROM ||
        process.env.MAIL_FROM ||
        "no-reply@example.local"
      : process.env[`${prefix}_MAIL_FROM`] ||
        process.env.SMTP_FROM ||
        process.env.MAIL_FROM ||
        "no-reply@example.local",
  };
}

function getConfiguredApps(): string[] {
  const apps = new Set<string>();

  // Get apps from environment variables
  Object.keys(process.env).forEach((key) => {
    const match = key.match(/^([A-Z0-9_]+)_SMTP_HOST$/);
    if (match) {
      apps.add(match[1].toLowerCase());
    }
  });

  // Get apps from template directories
  try {
    const fs = require("node:fs");
    const path = require("node:path");
    const templatesDir = path.join(process.cwd(), "src", "templates");
    if (fs.existsSync(templatesDir)) {
      const templateApps = fs
        .readdirSync(templatesDir, { withFileTypes: true })
        .filter((dirent: any) => dirent.isDirectory())
        .map((dirent: any) => dirent.name);
      templateApps.forEach((app: string) => apps.add(app));
    }
  } catch {
    // Ignore if templates directory doesn't exist
  }

  return Array.from(apps);
}

export default (): Configuration => {
  const configuredApps = getConfiguredApps();
  const apps: Record<string, SmtpConfig> = {};

  configuredApps.forEach((appName) => {
    apps[appName] = getAppSmtpConfig(appName);
  });

  return {
    http: {
      port: Number(process.env.PORT) || 3000,
    },
    apps,
    defaultSmtp: getAppSmtpConfig("default"),
  };
};
