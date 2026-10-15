import type { NextConfig } from "next";

// SSG con el modelo de caché anterior de Next 16: sin cacheComponents ni partialPrefetching.
// Ver docs/skills/seo-ux.
const nextConfig: NextConfig = {
  // Sin el ícono "N" de Next en desarrollo; los errores se siguen mostrando.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      // Tailwind procesa todo el CSS, pero cada archivo conserva su tipo: con una
      // sola regla `as: "*.css"`, los *.module.css se volvían CSS global y su
      // import llegaba vacío. Las condiciones son disjuntas porque Turbopack
      // ejecuta todas las reglas que coinciden.
      "*.css": [
        {
          condition: { not: { path: /\.module\.css$/ } },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
        {
          condition: { path: /\.module\.css$/ },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.module.css",
        },
      ],
    },
  },
};

export default nextConfig;
