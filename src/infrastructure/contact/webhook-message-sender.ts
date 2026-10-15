import 'server-only';

import type { MessageSender } from '@/core/application/contact/ports';
import { env } from '@/infrastructure/env';

export const webhookMessageSender: MessageSender = {
  send: async (message) => {
    const response = await fetch(env.contactWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!response.ok)
      throw new Error(`El webhook de contacto respondió ${response.status}`);
  },
};
