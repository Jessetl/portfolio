import type { MetadataRoute } from 'next';

import { getProfile } from '@/infrastructure/container';

// Una sola página: las rutas viejas redirigen (308) a sus anclas (next.config.ts).
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { siteUrl } = await getProfile();
  return [{ url: new URL('/', siteUrl).href }];
};

export default sitemap;
