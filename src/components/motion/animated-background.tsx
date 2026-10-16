'use client';

import { useEffect, useRef } from 'react';

type Rgb = [number, number, number];
type Particle = { x: number; y: number; vx: number; vy: number; size: number; depth: number };
type Ripple = { x: number; y: number; radius: number; life: number };

// "Fondo animado y puntero" de v2 · Motion & Flow spec.
const GRID = 30; // separación de los puntos
const DOT_REACH = 190; // puntos que se apartan e iluminan cerca del puntero
const LIGHT_RADIUS = 440; // luz que sigue al puntero
const LINK = 120; // líneas entre partículas
const POINTER_LINK = 228; // líneas de las partículas hacia el puntero
const REPEL = 90; // el puntero aparta las partículas
const MAX_RIPPLES = 4;

// Colores de los tokens (globals.css), como "r,g,b" para el canvas.
const tokenRgb = (name: string): Rgb => {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().slice(1);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
};
const mix = (a: Rgb, b: Rgb, t: number) =>
  a.map((value, i) => Math.round(value + (b[i] - value) * t)).join(',');

/**
 * Canvas fijo detrás de todo el contenido: cuadrícula de puntos que ondula,
 * dos luces ambientales y partículas que suben. Con el puntero, los puntos
 * cercanos se apartan e iluminan, una luz lo sigue, las partículas se unen a
 * él con líneas y cada clic lanza una onda. El color va de azul a cian y
 * vuelve a azul según el scroll. Con movimiento reducido queda estático.
 */
export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blue = tokenRgb('--blue');
    const cyan = tokenRgb('--cyan');
    const fg = tokenRgb('--fg').join(',');

    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false };
    const light = { x: 0, y: 0 };
    let targetScroll = scrollY;
    let scroll = targetScroll;
    let velocity = 0;
    let particles: Particle[] = [];
    const ripples: Ripple[] = [];

    const setup = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (light.x === 0) {
        light.x = width * 0.7;
        light.y = height * 0.3;
      }
      particles = Array.from({ length: width < 768 ? 23 : 46 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.1 - Math.random() * 0.25,
        size: 0.8 + Math.random() * 1.8,
        depth: 0.3 + Math.random() * 0.7,
      }));
    };

    const glow = (x: number, y: number, radius: number, color: string, alpha: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const progress = Math.min(
        scroll / Math.max(document.documentElement.scrollHeight - height, 1),
        1,
      );
      const swing = Math.sin(progress * Math.PI);
      const color = mix(blue, cyan, swing);
      const far = Math.max(width, height);

      // Luces ambientales (se mueven con el tiempo y el scroll) y la luz del puntero.
      glow(
        width * (0.15 + 0.7 * progress) + 60 * Math.sin(0.3 * time),
        height * (0.75 - 0.4 * swing) + 40 * Math.cos(0.25 * time),
        0.55 * far,
        cyan.join(','),
        0.11,
      );
      glow(
        width * (0.85 - 0.6 * progress) + 80 * Math.cos(0.2 * time),
        height * (0.2 + 0.5 * progress),
        0.4 * far,
        blue.join(','),
        0.06,
      );
      glow(light.x, light.y, LIGHT_RADIUS, color, pointer.active ? 0.14 : 0.07);

      // Cuadrícula: los puntos en reposo van en un solo trazo; los que reaccionan, aparte.
      const offset = (scroll * 0.25) % GRID;
      const amplitude = 4 + Math.min(Math.abs(velocity) * 0.3, 18);
      const phase = time * 0.6 + scroll * 0.004;
      const lit: [number, number, number][] = [];
      ctx.beginPath();
      ctx.fillStyle = `rgba(${fg}, 0.08)`;
      for (let gx = GRID / 2; gx < width + GRID; gx += GRID) {
        for (let gy = -offset; gy < height + GRID; gy += GRID) {
          const undulation = Math.sin(gx * 0.008 + phase) * Math.cos(gy * 0.006 + phase * 0.7);
          let x = gx;
          let y = gy + undulation * amplitude;
          let wave = 0;
          for (const ripple of ripples) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy);
            const near = 1 - Math.abs(distance - ripple.radius) / 40;
            if (near <= 0) continue;
            const push = near * ripple.life * 14;
            x += (dx / (distance || 1)) * push;
            y += (dy / (distance || 1)) * push;
            wave = Math.max(wave, near * ripple.life);
          }
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < DOT_REACH) {
            const strength = 1 - distance / DOT_REACH;
            const push = strength * strength * 28;
            x += (dx / (distance || 1)) * push;
            y += (dy / (distance || 1)) * push;
            lit.push([x, y, strength]);
          } else if (wave > 0.05) {
            lit.push([x, y, wave * 0.8]);
          } else {
            const size = 1 + ((undulation + 1) / 2) * 0.8;
            ctx.rect(x - size / 2, y - size / 2, size, size);
          }
        }
      }
      ctx.fill();
      for (const [x, y, strength] of lit) {
        ctx.fillStyle = `rgba(${color}, ${0.15 + 0.75 * strength})`;
        ctx.beginPath();
        ctx.arc(x, y, (1.4 + 2.4 * strength) / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Partículas: líneas entre las cercanas y hacia el puntero.
      ctx.lineWidth = 1;
      particles.forEach((p, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance >= LINK) continue;
          ctx.strokeStyle = `rgba(${fg}, ${(1 - distance / LINK) * 0.07})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
        if (!pointer.active) return;
        const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (distance >= POINTER_LINK) return;
        ctx.strokeStyle = `rgba(${color}, ${(1 - distance / POINTER_LINK) * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      });
      for (const p of particles) {
        ctx.fillStyle = `rgba(${color}, ${0.25 + 0.45 * p.depth})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = 1.5;
      for (const ripple of ripples) {
        ctx.strokeStyle = `rgba(${color}, ${0.35 * ripple.life})`;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const step = () => {
      time += 0.016;
      pointer.x += (pointer.targetX - pointer.x) * 0.15;
      pointer.y += (pointer.targetY - pointer.y) * 0.15;
      if (pointer.active) {
        light.x += (pointer.targetX - light.x) * 0.06;
        light.y += (pointer.targetY - light.y) * 0.06;
      }
      const next = scroll + (targetScroll - scroll) * 0.12;
      velocity = velocity * 0.9 + (next - scroll) * 0.6;
      scroll = next;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy - velocity * 0.08 * p.depth;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < REPEL) {
            const push = (1 - distance / REPEL) * 1.6;
            p.x += (dx / (distance || 1)) * push;
            p.y += (dy / (distance || 1)) * push;
          }
        }
        // Al salir por un borde, vuelven por el opuesto.
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 6;
        ripples[i].life -= 0.012;
        if (ripples[i].life <= 0) ripples.splice(i, 1);
      }
    };

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      if (!pointer.active) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }
      pointer.active = true;
    };
    const onPointerDown = (event: PointerEvent) => {
      ripples.push({ x: event.clientX, y: event.clientY, radius: 0, life: 1 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.targetX = -9999;
      pointer.targetY = -9999;
    };
    // En táctil no hay "salida": al soltar el dedo, el efecto se apaga.
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') onPointerLeave();
    };
    const onScroll = () => {
      targetScroll = scrollY;
      if (reduced) {
        scroll = targetScroll;
        draw();
      }
    };
    const onResize = () => {
      setup();
      if (reduced) draw();
    };
    // Con la pestaña oculta no se anima.
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    setup();
    addEventListener('resize', onResize);
    addEventListener('scroll', onScroll, { passive: true });
    if (reduced) {
      draw();
    } else {
      addEventListener('pointermove', onPointerMove, { passive: true });
      addEventListener('pointerdown', onPointerDown, { passive: true });
      addEventListener('pointerup', onPointerUp, { passive: true });
      addEventListener('pointercancel', onPointerUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', onResize);
      removeEventListener('scroll', onScroll);
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerdown', onPointerDown);
      removeEventListener('pointerup', onPointerUp);
      removeEventListener('pointercancel', onPointerUp);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className='pointer-events-none fixed inset-0 -z-10'>
      <canvas ref={canvasRef} className='size-full' />
      {/* Viñeta hacia bg/base y ruido al 3,5 % (spec). */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--base)_100%)]' />
      <div className='absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay' />
    </div>
  );
};
