import { useEffect, useRef } from 'react';
import { orbits, type OrbitId } from '../data/content';
import { readTokens } from '../lib/theme';

interface Props {
  active: OrbitId;
  onHover: (id: OrbitId | null) => void;
  onPick: (id: OrbitId) => void;
}

// Each ring: relative radius, speed (radians/sec) and a starting phase.
const RINGS = [
  { r: 0.4, speed: 0.22, phase: 0.3 },
  { r: 0.63, speed: -0.14, phase: 1.2 },
  { r: 0.86, speed: 0.09, phase: 2.4 },
];
const TILT = 0.42; // vertical squash of the ellipses

export default function OrbitCanvas({ active, onHover, onPick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const hoverRef = useRef<OrbitId | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tokens = readTokens();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = 0;
    const mouse = { x: 0, y: 0, inside: false };
    const tiltNow = { x: 0, y: 0 };
    // per-ring highlight 0..1, eased toward its target
    const glow = [0, 0, 0];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const ringIndex = (id: OrbitId | null) => orbits.findIndex((o) => o.id === id);

    const geometry = () => {
      const cx = w / 2 + tiltNow.x * 10;
      const cy = h / 2 + tiltNow.y * 8;
      // leave room for labels beside the outer ring
      const R = Math.max(40, Math.min((w / 2 - (w < 480 ? 88 : 78)) / 0.86, (h / 2 - 18) / (0.86 * 0.5)));
      const squash = TILT + tiltNow.y * 0.06;
      const rot = -0.18 + tiltNow.x * 0.08;
      return { cx, cy, R, squash, rot };
    };

    const project = (g: ReturnType<typeof geometry>, rr: number, a: number) => {
      const x = Math.cos(a) * rr * g.R;
      const y = Math.sin(a) * rr * g.R * g.squash;
      const cos = Math.cos(g.rot);
      const sin = Math.sin(g.rot);
      return { x: g.cx + x * cos - y * sin, y: g.cy + x * sin + y * cos, depth: Math.sin(a) };
    };

    const hitTest = (mx: number, my: number): OrbitId | null => {
      const g = geometry();
      // undo rotation and squash, then compare normalised radius
      const dx = mx - g.cx;
      const dy = my - g.cy;
      const cos = Math.cos(-g.rot);
      const sin = Math.sin(-g.rot);
      const x = dx * cos - dy * sin;
      const y = (dx * sin + dy * cos) / g.squash;
      const r = Math.hypot(x, y) / g.R;
      let best = -1;
      let bestD = 0.09;
      RINGS.forEach((ring, i) => {
        const d = Math.abs(r - ring.r);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best >= 0 ? orbits[best].id : null;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const g = geometry();
      const focus = ringIndex(hoverRef.current ?? activeRef.current);
      const colors = [tokens.software, tokens.data, tokens.ai];

      // ease highlights
      glow.forEach((v, i) => {
        glow[i] = v + ((i === focus ? 1 : 0) - v) * 0.12;
      });

      // collect items so back-side items draw first
      type Item = { x: number; y: number; depth: number; ring: number; label: string };
      const items: Item[] = [];

      RINGS.forEach((ring, i) => {
        // the ring itself
        ctx.save();
        ctx.translate(g.cx, g.cy);
        ctx.rotate(g.rot);
        ctx.scale(1, g.squash);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r * g.R, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = glow[i] > 0.05 ? colors[i] : tokens.muted;
        ctx.globalAlpha = 0.3 + glow[i] * 0.7;
        ctx.lineWidth = 1 + glow[i] * 1.2;
        ctx.setLineDash(glow[i] > 0.5 ? [] : [3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        const list = orbits[i].items;
        list.forEach((label, k) => {
          const a = ring.phase + (k / list.length) * Math.PI * 2 + t * ring.speed;
          const p = project(g, ring.r, a);
          items.push({ ...p, ring: i, label });
        });
      });

      // centre
      const drawCentre = () => {
        ctx.beginPath();
        ctx.arc(g.cx, g.cy, 22, 0, Math.PI * 2);
        ctx.fillStyle = tokens.ink;
        ctx.fill();
        ctx.fillStyle = tokens.bg;
        ctx.font = '700 14px "Bricolage Grotesque", Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AP', g.cx, g.cy + 1);
      };

      items.sort((a, b) => a.depth - b.depth);
      let centreDrawn = false;
      for (const it of items) {
        if (!centreDrawn && it.depth > 0) {
          drawCentre();
          centreDrawn = true;
        }
        const lit = glow[it.ring];
        const size = 3 + it.depth * 1.2 + lit * 2.5;
        ctx.globalAlpha = 0.45 + (it.depth + 1) * 0.2 + lit * 0.3;
        ctx.beginPath();
        ctx.arc(it.x, it.y, Math.max(1.5, size), 0, Math.PI * 2);
        ctx.fillStyle = colors[it.ring];
        ctx.fill();
        if (lit > 0.15) {
          ctx.globalAlpha = Math.min(1, lit * 1.1) * (0.55 + (it.depth + 1) * 0.22);
          ctx.fillStyle = tokens.ink;
          ctx.font = `500 ${w < 480 ? 10 : 12}px "JetBrains Mono", ui-monospace, monospace`;
          ctx.textAlign = it.x > g.cx ? 'left' : 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(it.label, it.x + (it.x > g.cx ? 10 : -10), it.y);
        }
        ctx.globalAlpha = 1;
      }
      if (!centreDrawn) drawCentre();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      const tx = mouse.inside ? (mouse.x / w - 0.5) * 2 : 0;
      const ty = mouse.inside ? (mouse.y / h - 0.5) * 2 : 0;
      tiltNow.x += (tx - tiltNow.x) * 0.06;
      tiltNow.y += (ty - tiltNow.y) * 0.06;
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.inside = true;
      const hit = hitTest(mouse.x, mouse.y);
      if (hit !== hoverRef.current) {
        hoverRef.current = hit;
        onHover(hit);
      }
      canvas.style.cursor = hit ? 'pointer' : 'default';
    };
    const onLeave = () => {
      mouse.inside = false;
      hoverRef.current = null;
      onHover(null);
    };
    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
      if (hit) onPick(hit);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (!visible) draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => {
      visible = !document.hidden;
      if (visible) start();
    };
    document.addEventListener('visibilitychange', onVis);
    const mo = new MutationObserver(() => {
      tokens = readTokens();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => {
      tokens = readTokens();
    };
    mq.addEventListener('change', onScheme);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerup', onClick);
    document.fonts?.ready.then(() => draw());
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener('change', onScheme);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerup', onClick);
    };
  }, [onHover, onPick]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full touch-pan-y"
      role="img"
      aria-label="Three orbits around my initials: software, data and AI, each with the tools I use."
    />
  );
}
