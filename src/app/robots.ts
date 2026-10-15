import type { MetadataRoute } from 'next';

import { getProfile } from '@/infrastructure/container';

const robots = async (): Promise<MetadataRoute.Robots> => {
  const { siteUrl } = await getProfile();
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  };
};

export default robots;
