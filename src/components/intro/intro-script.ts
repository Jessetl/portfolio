/**
 * Corre en el <head>, antes del primer pintado: activa la intro solo al entrar
 * por "/", una vez por sesión y nunca con `prefers-reduced-motion`. Sin JS no
 * hay intro y el inicio se ve directo.
 */
export const introScript = `(() => {
  try {
    if (location.pathname !== '/' || sessionStorage.getItem('intro-vista')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sessionStorage.setItem('intro-vista', '1');
    document.documentElement.setAttribute('data-intro', '');
  } catch {}
})();`;
