import {
  createContactMessage,
  type ContactMessage,
  type ContactMessageError,
  type ContactMessageInput,
} from '@/core/domain/contact/contact-message';

import type { HumanVerifier, MessageSender } from './ports';

export type SendContactMessageResult =
  | { ok: true; value: ContactMessage }
  | { ok: false; errors: ContactMessageError[] }
  | { ok: false; spam: true };

/**
 * Antispam: el campo trampa (invisible para personas) debe llegar vacío y el
 * captcha, aprobado. Se valida antes del captcha para no consultarlo con un
 * formulario inválido. Un fallo del envío es inesperado: se lanza y lo
 * captura la Server Action.
 */
export const makeSendContactMessage =
  ({ sender, verifier }: { sender: MessageSender; verifier: HumanVerifier }) =>
  async (
    input: ContactMessageInput,
    { trap, token }: { trap: string; token: string },
  ): Promise<SendContactMessageResult> => {
    if (trap) return { ok: false, spam: true };

    const message = createContactMessage(input);
    if (!message.ok) return message;

    if (!(await verifier.verify(token))) return { ok: false, spam: true };

    await sender.send(message.value);
    return message;
  };
