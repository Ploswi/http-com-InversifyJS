import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'inversify';
import { Mailer } from '../../domain/interfaces/Mailer';
import { Logger } from '../../domain/interfaces/Logger';
import { TYPES } from '../../container/types';

@injectable()
export class NodemailerMailer implements Mailer
{
  private transporter: Transporter | null = null;

  constructor
  (
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  private async getMailClient(): Promise<Transporter>
  {
    if (this.transporter)
      {
      return this.transporter;
    }

    if (process.env.APP_ENV === 'dev')
    {
      // Ethereal (DEV)
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      this.logger.info(`Ethereal Mail configurado: ${testAccount.user}`);
    }
    else
      {
      // SMTP REAL (PROD)
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      this.logger.info('SMTP de produção configurado');
    }

    return this.transporter;
  }

  async send(to: string, subject: string, body: string): Promise<void>
  {
    const mailClient = await this.getMailClient();

    const info = await mailClient.sendMail({
      to,
      subject,
      text: body,
    });

    if (process.env.APP_ENV === 'dev') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.info(`Preview do e-mail: ${previewUrl}`);
      }
    }
  }
}