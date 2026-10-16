import Link from 'next/link';

import { navSections } from './sections';

/**
 * Nav del header desde 1024 px. HeaderScroll marca la sección activa
 * (aria-current) y desliza el subrayado degradado hasta ella en 250 ms.
 */
export const NavLinks = () => (
  <nav aria-label='Principal' className='relative hidden lg:block'>
    <ul className='flex gap-8'>
      {navSections.map(({ id, label }) => (
        <li key={id}>
          <Link
            href={`/#${id}`}
            data-nav-link
            className='block text-nav font-medium text-fg-muted transition-colors duration-200 aria-[current]:text-fg'
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
    <span
      aria-hidden
      data-nav-indicator
      className='absolute top-[calc(100%+6px)] left-0 h-0.5 w-(--w) translate-x-(--x) rounded-xs bg-linear-to-r/srgb from-blue to-cyan opacity-0 transition-[translate,width,opacity] duration-250 ease-out data-active:opacity-100 motion-reduce:transition-opacity motion-reduce:duration-150'
    />
  </nav>
);
