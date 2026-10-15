import 'server-only';

import type { HumanVerifier } from '@/core/application/contact/ports';
import { env } from '@/infrastructure/env';

// Siteverify de Cloudflare Turnstile: cada token vale una vez y caduca a los 300 s.
export const turnstileVerifier: HumanVerifier = {
  verify: async (token) => {
    if (!token) return false;
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({
          secret: env.turnstileSecretKey(),
          response: token,
        }),
      },
    );
    if (!response.ok)
      throw new Error(`Turnstile respondió ${response.status}`);
    const { success } = (await response.json()) as { success: boolean };
    return success;
  },
};
