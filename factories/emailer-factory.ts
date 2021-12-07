import { createTransport, Transporter } from 'nodemailer';
import { Emailer } from '../classes/emailer';

export class EmailerFactory {
  static createEmailer(): Emailer {
    const transporter: Transporter = EmailerFactory.getTransporter();

    const emailer = new Emailer(transporter);

    return emailer;
  }

  static getTransporter(): Transporter {
    return createTransport({
      host: process.env.MAILGUN_SMTP_SERVER,
      port: parseInt(process.env.MAILGUN_SMTP_PORT, 10),
      secure: true, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAILGUN_SMTP_LOGIN,
        pass: process.env.MAILGUN_SMTP_PASSWORD,
      },
    });
  }
}
