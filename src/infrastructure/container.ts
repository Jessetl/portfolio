import 'server-only';

import { makeSendContactMessage } from '@/core/application/contact/send-contact-message';
import { resendMessageSender } from '@/infrastructure/contact/resend-message-sender';
import { turnstileVerifier } from '@/infrastructure/contact/turnstile-verifier';
import { env } from '@/infrastructure/env';
import { jsonExperienceRepository } from '@/infrastructure/experience/json-experience-repository';
import { jsonProfileRepository } from '@/infrastructure/profile/json-profile-repository';
import { jsonProjectRepository } from '@/infrastructure/projects/json-project-repository';
import { jsonStackRepository } from '@/infrastructure/stack/json-stack-repository';

// Composition root: el único lugar que sabe qué adaptador implementa cada puerto.
// Lecturas sin reglas: se expone el repositorio directo, sin caso de uso.
export const getProfile = jsonProfileRepository.get;
export const getStack = jsonStackRepository.get;
export const listProjects = jsonProjectRepository.list;
export const listJobs = jsonExperienceRepository.list;
export const sendContactMessage = makeSendContactMessage({
  sender: resendMessageSender,
  verifier: turnstileVerifier,
});
// Clave pública del captcha: la página se la pasa al formulario.
export const getTurnstileSiteKey = env.turnstileSiteKey;
export const getAnalyticsIds = () => ({
  ga: env.gaMeasurementId(),
  clarity: env.clarityProjectId(),
});
