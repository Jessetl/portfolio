import { ArrowDown, ArrowDownRight, Download, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import { sectionAttrs } from '@/components/analytics/section';
import { Magnetic } from '@/components/motion/magnetic';
import { container } from '@/components/site/container';
import { CV_HREF } from '@/components/site/cv';
import { IconLink } from '@/components/site/icon-link';
import { Github, Linkedin } from '@/components/ui/brand-icons';
import { buttonVariants } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Glow } from '@/components/ui/glow';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

/**
 * Hero v2: cuadrícula de 64 px que se desvanece desde la izquierda, brillos
 * cian y azul, y el nombre con el degradado animado. Un solo CTA primario
 * ("Ver proyectos"). En desktop llena la primera pantalla con el aviso de
 * scroll abajo.
 */
export const Hero = ({ profile }: { profile: Profile }) => {
  const { github, linkedin } = profile.links;

  return (
    <section
      {...sectionAttrs('home')}
      className='relative overflow-hidden lg:min-h-[calc(100svh-4.5rem)]'
    >
      <div
        aria-hidden
        className='absolute inset-0 bg-grid [mask-image:radial-gradient(70%_70%_at_35%_40%,black,rgb(0_0_0/0.05))]'
      />
      <Glow
        color='cyan'
        alpha={16}
        className='top-130 -left-45 size-90 lg:top-95 lg:-left-55 lg:size-160'
      />
      <Glow
        color='blue'
        alpha={28}
        className='-top-60 -right-46 size-130 lg:-top-90 lg:-right-55 lg:size-225'
      />

      <div className={cn(container, 'relative pt-14 pb-26 lg:pt-28 lg:pb-30')}>
        <Chip variant='status' className='text-fg-muted'>
          {profile.availability}
        </Chip>
        <p className='mt-7 font-mono text-greeting text-accent lg:mt-8'>{'// Hola, soy'}</p>
        <h1 className='mt-2.5 w-fit animate-gradient text-display font-semibold text-gradient-animated motion-reduce:animate-none lg:mt-3'>
          {profile.name}
        </h1>
        <p className='mt-3.5 text-role font-medium lg:mt-4.5'>
          {profile.role} · {profile.headline}
        </p>
        <p className='mt-4 max-w-190 text-lead text-fg-muted lg:mt-5'>{profile.summary}</p>
        <p className='mt-4.5 flex items-center gap-2 text-small text-fg-subtle lg:mt-5'>
          <MapPin aria-hidden className='size-4 shrink-0' />
          {profile.location}
        </p>

        <div className='mt-8 flex flex-wrap items-center gap-3 lg:mt-10'>
          <Magnetic>
            <Link href='/#proyectos' {...ctaAttrs('projects', 'hero')} className={buttonVariants()}>
              Ver proyectos
              <ArrowDownRight aria-hidden />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href='/#contacto'
              {...ctaAttrs('contact', 'hero')}
              className={buttonVariants({ variant: 'secondary' })}
            >
              <Mail aria-hidden />
              Hablemos
            </Link>
          </Magnetic>
          <a
            href={CV_HREF}
            download
            {...ctaAttrs('cv', 'hero')}
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Download aria-hidden />
            Descargar CV<span className='sr-only'> (PDF)</span>
          </a>
          <IconLink
            href={github.href}
            label='GitHub'
            icon={Github}
            external
            {...ctaAttrs('github', 'hero')}
          />
          <IconLink
            href={linkedin.href}
            label='LinkedIn'
            icon={Linkedin}
            external
            {...ctaAttrs('linkedin', 'hero')}
          />
        </div>

        {/* En desktop, una fila con separadores; en mobile, apiladas y en una línea. */}
        <ul className='mt-10 flex flex-col gap-4.5 lg:mt-16 lg:flex-row lg:items-center lg:gap-12'>
          {profile.stats.map((stat, i) => (
            <li key={stat.value} data-reveal className='flex items-center'>
              {i > 0 && <span aria-hidden className='mr-12 hidden h-10 w-px bg-line-strong lg:block' />}
              <span className='flex items-center gap-3.5'>
                <span className='text-stat font-semibold'>{stat.value}</span>
                <span className='text-small text-fg-subtle lg:whitespace-pre-line'>{stat.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href='/#sobre-mi'
        aria-label='Ir a Sobre mí'
        className='absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex'
      >
        <span aria-hidden className='font-mono text-eyebrow font-medium text-fg-subtle uppercase'>
          Scroll
        </span>
        <span
          aria-hidden
          className='flex h-9 w-7 items-center justify-center rounded-full ring-1 ring-line-strong ring-inset'
        >
          <ArrowDown className='size-4 text-fg-muted' />
        </span>
      </Link>
    </section>
  );
};
