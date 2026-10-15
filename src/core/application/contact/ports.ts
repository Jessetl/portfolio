import type { ContactMessage } from '@/core/domain/contact/contact-message';

export interface MessageSender {
  send: (message: ContactMessage) => Promise<void>;
}
