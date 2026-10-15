import type { MetadataRoute } from 'next';

import { screens } from '@/components/site/screens';
import { getProfile } from '@/infrastructure/container';

// Google solo usa las URLs: sin priority ni changeFrequency.
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { siteUrl } = await getProfile();
  return screens.map(({ href }) => ({ url: new URL(href, siteUrl).href }));
};

export default sitemap;
