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
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
}
