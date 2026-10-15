import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Tamaños de texto propios (tokens en globals.css). Sin registrarlos,
// tailwind-merge los toma por colores y descarta `text-h2` o `text-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'h1',
            'h2',
            'h3',
            'eyebrow',
            'mono',
            'button',
            'button-sm',
            'logo-lg',
            'terminal',
            'caption',
            'chip',
            'chip-lg',
            'lead',
            'body-xl',
            'body-lg',
            'body-md',
            'field',
            'body-sm',
            'body-xs',
            'intro',
            'card-title',
            'card-title-sm',
            'card-title-lg',
            'card-title-xl',
            'card-body',
            'card-body-sm',
            'detail-title',
            'detail-body',
            'metric',
            'chip-xs',
            'overline',
            'monogram',
            'stat',
            'label',
            'code',
          ],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
