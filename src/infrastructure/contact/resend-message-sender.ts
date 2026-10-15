import 'server-only';

import type { MessageSender } from '@/core/application/contact/ports';
import { env } from '@/infrastructure/env';

// API REST de Resend, sin SDK. Al responder el correo, le contestas a quien escribió.
export const resendMessageSender: MessageSender = {
  send: async ({ name, email, projectType, body }) => {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.resendApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.contactFromEmail(),
        to: env.contactToEmail(),
        reply_to: email,
        // El asunto es una cabecera: sin saltos de línea.
        subject: `Portfolio · ${name.replace(/\s+/g, ' ')} (${projectType})`,
        text: `${body}\n\n— ${name} <${email}>\nTipo de proyecto: ${projectType}`,
      }),
    });
    if (!response.ok)
      throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
  },
};
