import {
  createContactMessage,
  type ContactMessage,
  type ContactMessageError,
  type ContactMessageInput,
} from '@/core/domain/contact/contact-message';

import type { MessageSender } from './ports';

export type SendContactMessageResult =
  | { ok: true; value: ContactMessage }
  | { ok: false; errors: ContactMessageError[] };

// Un fallo del envío es inesperado: se lanza y lo captura la Server Action.
export const makeSendContactMessage =
  ({ sender }: { sender: MessageSender }) =>
  async (input: ContactMessageInput): Promise<SendContactMessageResult> => {
    const message = createContactMessage(input);
    if (!message.ok) return message;

    await sender.send(message.value);
    return message;
  };
