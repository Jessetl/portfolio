// Corre en <head> antes del primer pintado: con JS, los [data-reveal] arrancan
// ocultos hasta que RevealOnScroll los muestra. Si la hidratación no llega en
// 3 s, se muestra todo. Sin JS no se oculta nada.
export const revealScript = `(() => {
  try {
    const root = document.documentElement;
    root.setAttribute('data-reveal-ready', '');
    setTimeout(() => {
      if (!root.hasAttribute('data-reveal-active')) root.removeAttribute('data-reveal-ready');
    }, 3000);
  } catch {}
})();`;
