import Link from 'next/link';

/** Logo del header de Penpot. Bajo 360 px el texto queda solo para lectores. */
export const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link href='/' onClick={onClick} className='flex items-center gap-3 font-mono'>
    <span aria-hidden className='text-h3 leading-ui font-bold'>
      <span className='text-accent-text'>{'</'}</span>JM
      <span className='text-accent-text'>{'>'}</span>
    </span>
    <span className='text-mono font-medium text-muted-foreground max-[359px]:sr-only'>
      jesus.matute<span className='sr-only'>, inicio</span>
    </span>
  </Link>
);
