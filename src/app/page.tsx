import { Intro } from '@/components/intro/intro';
import { HomeScreen } from '@/components/profile/home-screen';
import { getProfile } from '@/infrastructure/container';

// 00 · Intro (overlay de la primera visita) + 01 · Inicio.
const HomePage = async () => {
  const profile = await getProfile();

  return (
    <>
      <Intro />
      <HomeScreen profile={profile} />
    </>
  );
};

export default HomePage;
