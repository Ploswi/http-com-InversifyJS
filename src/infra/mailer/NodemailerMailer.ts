import nodemailer from 'nodemailer';
import { Mailer } from '../../domain/interfaces/Mailer';

export class NodemailerMailer implements Mailer {
  private transporter: any;

  constructor(env: string) {
    this.transporter = env === 'dev'
      ? nodemailer.createTestAccount().then(acc =>
          nodemailer.createTransport({
            host: acc.smtp.host,
            port: acc.smtp.port,
            secure: acc.smtp.secure,
            auth: { user: acc.user, pass: acc.pass }
          })
        )
      : Promise.resolve(
          nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          })
        );
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    const t = await this.transporter;
    const info = await t.sendMail({ to, subject, text: body });

    if (process.env.APP_ENV === 'dev') {
      console.log('Preview:', nodemailer.getTestMessageUrl(info));
    }
  }
}
