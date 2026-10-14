import 'server-only';

import { jsonProfileRepository } from '@/infrastructure/profile/json-profile-repository';

// Composition root: el único lugar que sabe qué adaptador implementa cada puerto.
// Lecturas sin reglas: se expone el repositorio directo, sin caso de uso.
export const getProfile = jsonProfileRepository.get;
