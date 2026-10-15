import type { ContactMessage } from '@/core/domain/contact/contact-message';

export interface MessageSender {
  send: (message: ContactMessage) => Promise<void>;
}

// Captcha: confirma que el token del formulario lo generó una persona.
export interface HumanVerifier {
  verify: (token: string) => Promise<boolean>;
}
