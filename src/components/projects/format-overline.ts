// "Fintech · Mercado de capitales · 2023 – 2025": partes presentes, separadas
// por " · ". Los años van con espacios de no separación para no partirse.
export const formatOverline = (
  parts: (string | undefined)[],
  period: string,
) => [...parts, period.replaceAll(' ', ' ')].filter(Boolean).join(' · ');
