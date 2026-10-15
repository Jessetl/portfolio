import type { Metadata } from 'next';

import { StackScreen } from '@/components/stack/stack-screen';
import { ScreenTransition } from '@/components/motion/screen-transition';
import { getStack } from '@/infrastructure/container';

export const metadata: Metadata = {
  title: 'Stack',
  description:
    'Elijo la herramienta según el problema, no al revés. Estas son las que uso a diario en producción.',
};

const StackPage = async () => {
  const stack = await getStack();

  return (
    <ScreenTransition>
      <StackScreen stack={stack} />
    </ScreenTransition>
  );
};

export default StackPage;
