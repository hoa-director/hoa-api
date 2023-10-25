import { createTransport, Transporter } from "nodemailer";
import { Emailer } from "../classes/emailer.js";

export class EmailerFactory {
  static createEmailer(): Emailer {
    const transporter: Transporter = EmailerFactory.getTransporter();

    const emailer = new Emailer(transporter);

    return emailer;
  }

  static getTransporter(): Transporter {

    let smtpPort : string = process.env.SMTP_PORT ?? "";
    return createTransport({
      host: smtpPort,
      port: parseInt(smtpPort, 10),
      secure: false, // upgrade later with STARTTLS
      requireTLS: true, // if this is true and secure is false, requires STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
}
