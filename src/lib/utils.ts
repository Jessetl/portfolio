import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Tamaños de texto propios (tokens en globals.css). Sin registrarlos,
// tailwind-merge los toma por colores y descarta `text-h2` o `text-fg`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'numeral',
            'contact',
            'h2',
            'project-title',
            'project-title-lg',
            'project-role',
            'project-meta',
            'project-item',
            'project-item-lg',
            'project-tool',
            'project-link',
            'project-link-lg',
            'stat',
            'menu',
            'sent',
            'h3',
            'role',
            'title-lg',
            'title',
            'title-sm',
            'lead',
            'bio',
            'body',
            'card',
            'small',
            'nav',
            'button',
            'button-sm',
            'eyebrow',
            'mono',
            'greeting',
            'period',
            'chip',
            'terminal',
            'logo',
            'logo-sm',
            'logo-lg',
          ],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
