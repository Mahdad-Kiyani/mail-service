# Multi-Tenant Email Service Guide

This email microservice supports multi-tenant configuration, allowing different applications to use their own SMTP settings and email templates.

## How It Works

The service automatically detects configured apps based on:

1. Environment variables with app-specific prefixes (e.g., `APP1_SMTP_HOST`)
2. Template directories in `src/templates/`

Each app gets its own SMTP configuration and can have its own email templates.

## Configuration

### Environment Variables

Use the following pattern for app-specific configuration:

```bash
# App-specific SMTP settings
{APP_NAME}_SMTP_HOST=smtp.example.com
{APP_NAME}_SMTP_PORT=587
{APP_NAME}_SMTP_USER=username
{APP_NAME}_SMTP_PASS=password
{APP_NAME}_SMTP_SECURE=true
{APP_NAME}_MAIL_FROM=App Name <noreply@app.com>
```

### Example Configurations

#### App1 (Gmail)

```bash
APP1_SMTP_HOST=smtp.gmail.com
APP1_SMTP_PORT=587
APP1_SMTP_USER=app1@yourcompany.com
APP1_SMTP_PASS=your-app-password
APP1_SMTP_SECURE=true
APP1_MAIL_FROM=App1 <noreply@app1.com>
```

#### App2 (SendGrid)

```bash
APP2_SMTP_HOST=smtp.sendgrid.net
APP2_SMTP_PORT=587
APP2_SMTP_USER=apikey
APP2_SMTP_PASS=your-sendgrid-api-key
APP2_SMTP_SECURE=true
APP2_MAIL_FROM=App2 <noreply@app2.com>
```

#### Falcgo (Mailgun)

```bash
FALCGO_SMTP_HOST=smtp.mailgun.org
FALCGO_SMTP_PORT=587
FALCGO_SMTP_USER=postmaster@mg.falcgo.com
FALCGO_SMTP_PASS=your-mailgun-password
FALCGO_SMTP_SECURE=true
FALCGO_MAIL_FROM=Falcgo <noreply@falcgo.com>
```

## Template Structure

Organize templates by app in the `src/templates/` directory:

```
src/templates/
├── app1/
│   ├── welcome.hbs
│   └── reset-password.hbs
├── app2/
│   └── order-confirmation.hbs
└── falcgo/
    ├── welcome.hbs
    └── notification.hbs
```

## API Usage

### Send Email

```bash
POST /send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome!",
  "app": "app1",
  "template": "welcome",
  "context": {
    "name": "John Doe",
    "company": "Acme Corp"
  }
}
```

### Get Configured Apps

```bash
GET /apps

Response:
{
  "apps": ["app1", "app2", "falcgo"]
}
```

### Get App Configuration

```bash
GET /apps/app1/config

Response:
{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": true,
  "from": "App1 <noreply@app1.com>",
  "hasAuth": true
}
```

## Fallback Behavior

- If an app doesn't have specific SMTP configuration, it falls back to the default SMTP settings
- If no default SMTP is configured, it uses localhost:1025 (typical for development with MailHog)

## Development

### Local Testing with MailHog

For local development, you can use MailHog to capture emails:

```bash
# Install MailHog
go install github.com/mailhog/MailHog@latest

# Start MailHog
MailHog

# Configure environment
SMTP_HOST=localhost
SMTP_PORT=1025
```

### Testing Different Apps

```bash
# Test app1
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test from App1",
    "app": "app1",
    "template": "welcome",
    "context": {"name": "Test User"}
  }'

# Test app2
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test from App2",
    "app": "app2",
    "template": "order-confirmation",
    "context": {"orderId": "12345"}
  }'
```

## Security Considerations

- SMTP passwords are stored in environment variables
- The `/apps/:appName/config` endpoint doesn't expose sensitive information
- App names are validated to prevent injection attacks
- Each app's SMTP configuration is isolated

## Monitoring

The service logs:

- SMTP configuration used for each email
- Template resolution paths
- Email delivery success/failure
- App-specific SMTP connection details

Check logs to monitor which SMTP server each app is using.
