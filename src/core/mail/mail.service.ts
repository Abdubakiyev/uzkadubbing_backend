import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Email tasdiqlash kodi',
        text: `Sizning tasdiqlash kodingiz: ${code}`,
        html: `<p>Sizning tasdiqlash kodingiz: <b>${code}</b></p>`,
      });
      this.logger.log(`✅ Email yuborildi: ${to}`);
    } catch (error) {
      this.logger.error(`❌ Email yuborishda xato: ${to}`, error as any);
    }
  }
}
