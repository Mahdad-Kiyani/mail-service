<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Production-ready Email Microservice built with NestJS. It supports dynamic template selection per request and can be extended with new apps/templates without changing core logic.

## Project setup

```bash
npm install
```

## Run in development (with Mailpit)

Mailpit provides a local SMTP server and web UI.

```bash
docker compose up --build
# Service: http://localhost:3000
# Mailpit UI: http://localhost:8025
```

Alternatively without Docker Compose, install Mailpit and run the app:

```bash
export NODE_ENV=development
export SMTP_HOST=localhost
export SMTP_PORT=1025
export MAIL_FROM="Mail Service <no-reply@example.local>"
npm run start:dev
```

## Production configuration

Configure real SMTP via environment variables:

```bash
NODE_ENV=production \
PORT=3000 \
SMTP_HOST=smtp.yourprovider.com \
SMTP_PORT=587 \
SMTP_USER=your_user \
SMTP_PASS=your_password \
SMTP_SECURE=false \
MAIL_FROM="Your App <no-reply@yourdomain.com>" \
npm run build && npm run start:prod
```

Create a `.env` file (optional) and Nest will load it if using `ConfigModule.forRoot` defaults.

```
NODE_ENV=development
PORT=3000
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
MAIL_FROM=Mail Service <no-reply@example.local>
```

## API

- POST `/send-email`

Request body:

```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "app": "app1",
  "template": "welcome",
  "context": { "name": "John" }
}
```

Responses:

- 202 Accepted: `{ "status": "accepted" }`
- 404 Not Found if template missing
- 400 Bad Request for validation errors

Health check:

- GET `/health` → 200 OK

## Template structure

Add Handlebars templates under `src/templates/{app}/{template}.hbs`.

Examples:

```
src/templates/app1/welcome.hbs
src/templates/app1/reset-password.hbs
src/templates/app2/order-confirmation.hbs
```

Adding a new template:

1. Create the file at the path above
2. No code changes needed
3. Rebuild if running in Docker so assets are copied to `dist`

## Development notes

- Uses `@nestjs/config` with runtime validation via `class-validator`
- Logs via `nestjs-pino` with pretty logs in development
- Handlebars for templating, resolved dynamically from request payload
- Assets are copied via `nest-cli.json` assets config and Dockerfile step

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
