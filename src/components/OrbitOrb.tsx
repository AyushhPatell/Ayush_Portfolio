import { useEffect, useRef, useState } from 'react';

// ORBIT's orb: a dark sphere with a small constellation inside and arcs of light around it.
// It reacts to four states, the same ones the real app moves through.
const STATES = [
  { id: 'idle', label: 'Idle', note: 'Resting, keeping an eye on things.' },
  { id: 'listening', label: 'Listening', note: 'The rings ripple with your voice.' },
  { id: 'thinking', label: 'Thinking', note: 'The constellation lights up as it connects ideas.' },
  { id: 'speaking', label: 'Speaking', note: 'The orb breathes with its words.' },
] as const;
type StateId = (typeof STATES)[number]['id'];

// speed, ring speed, ripple, line glow, breathing
const PROFILE: Record<StateId, [number, number, number, number, number]> = {
  idle: [0.12, 0.25, 0, 0.25, 0.015],
  listening: [0.18, 0.45, 1, 0.35, 0.02],
  thinking: [0.7, 1.1, 0.15, 1, 0.01],
  speaking: [0.22, 0.5, 0.35, 0.45, 0.07],
};

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
}

export default function OrbitOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<StateId>('idle');
  const stateRef = useRef<StateId>('idle');
  const pickedAt = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Cycle through the states on its own, pausing for a while after a visitor picks one.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (Date.now() - pickedAt.current < 9000) return;
      setState((s) => STATES[(STATES.findIndex((x) => x.id === s) + 1) % STATES.length].id);
    }, 3600);
    return () => window.clearInterval(id);
  }, []);

  const pick = (id: StateId) => {
    pickedAt.current = Date.now();
    setState(id);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = 0;
    let spin = 0;
    let ringSpin = 0;
    const cur = [...PROFILE.idle];

    // stars on a sphere-ish cloud, seeded so the shape never changes
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const stars: Star[] = Array.from({ length: 16 }, () => {
      const u = rnd() * 2 - 1;
      const a = rnd() * Math.PI * 2;
      const r = 0.25 + rnd() * 0.45;
      const s = Math.sqrt(1 - u * u);
      return { x: Math.cos(a) * s * r, y: u * r * 0.8, z: Math.sin(a) * s * r, size: 0.6 + rnd() * 1.4 };
    });
    // arcs of particles: radius factor, coverage, start angle, dot count, direction
    const arcs = [
      { r: 1.22, cover: 0.62, start: 0.4, n: 34, dir: 1 },
      { r: 1.36, cover: 0.48, start: 2.6, n: 30, dir: -1 },
      { r: 1.5, cover: 0.7, start: 4.4, n: 40, dir: 1 },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, w);
      const c = w / 2;
      const [, , ripple, lineGlow, breathe] = cur;
      const voice = 0.5 + 0.5 * Math.sin(t * 9) * Math.sin(t * 3.7 + 1);
      const R = w * 0.27 * (1 + breathe * Math.sin(t * 5.5) * (0.6 + voice * 0.4));

      // halo
      const halo = ctx.createRadialGradient(c, c, R * 0.8, c, c, R * 1.9);
      halo.addColorStop(0, 'rgba(110,180,255,0.32)');
      halo.addColorStop(1, 'rgba(110,180,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(c, c, R * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // arcs of light
      arcs.forEach((a, ai) => {
        for (let i = 0; i < a.n; i++) {
          const f = i / (a.n - 1);
          const ang = a.start + ringSpin * a.dir * (1 + ai * 0.25) + f * a.cover * Math.PI * 2;
          const wobble = ripple * Math.sin(ang * 5 + t * 6 + ai) * (0.03 + voice * 0.05);
          const rr = R * (a.r + wobble);
          const x = c + Math.cos(ang) * rr;
          const y = c + Math.sin(ang) * rr;
          const fade = Math.sin(f * Math.PI);
          ctx.globalAlpha = 0.15 + fade * 0.7;
          ctx.fillStyle = '#7cc4ff';
          ctx.beginPath();
          ctx.arc(x, y, 0.6 + fade * 1.6 + ((i * 7) % 3) * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // sphere
      const body = ctx.createRadialGradient(c - R * 0.25, c - R * 0.1, R * 0.1, c, c, R);
      body.addColorStop(0, '#02030f');
      body.addColorStop(0.55, '#07113a');
      body.addColorStop(0.86, '#14408c');
      body.addColorStop(1, 'rgba(120,190,255,0.9)');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();

      // constellation inside, rotating around the vertical axis
      ctx.save();
      ctx.beginPath();
      ctx.arc(c, c, R * 0.97, 0, Math.PI * 2);
      ctx.clip();
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);
      const pts = stars.map((s) => {
        const x = s.x * cos - s.z * sin;
        const z = s.x * sin + s.z * cos;
        return { x: c + x * R * 1.25, y: c + s.y * R * 1.25, z, size: s.size };
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) / R;
          if (d > 0.55) continue;
          const pulse = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.3 + j);
          ctx.globalAlpha = (1 - d / 0.55) * (0.12 + lineGlow * 0.5 * pulse);
          ctx.strokeStyle = '#9fd3ff';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      for (const p of pts) {
        const depth = (p.z + 1) / 2;
        const size = p.size * (0.7 + depth * 0.9);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        g.addColorStop(0, 'rgba(220,240,255,0.95)');
        g.addColorStop(1, 'rgba(120,180,255,0)');
        ctx.globalAlpha = 0.35 + depth * 0.65;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;

      // rim light
      ctx.strokeStyle = 'rgba(170,215,255,0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.stroke();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = PROFILE[stateRef.current];
      for (let i = 0; i < cur.length; i++) cur[i] += (target[i] - cur[i]) * Math.min(1, dt * 3);
      if (!reduce) {
        t += dt;
        spin += dt * cur[0];
        ringSpin += dt * cur[1];
      }
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      if (visible) start();
    });
    io.observe(canvas);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const info = STATES.find((s) => s.id === state)!;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => pick(STATES[(STATES.findIndex((x) => x.id === state) + 1) % STATES.length].id)}
        className="aspect-square w-full max-w-[240px] rounded-full"
        aria-label={`ORBIT's orb, currently ${info.label.toLowerCase()}. Click to change state.`}
      >
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      </button>
      <div className="mt-1 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Orb state">
        {STATES.map((s) => (
          <button
            key={s.id}
            onClick={() => pick(s.id)}
            aria-pressed={state === s.id}
            className="chip !px-2.5 !text-[11px] transition-colors"
            style={state === s.id ? { borderColor: 'var(--ai)', color: 'var(--ink)' } : undefined}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[2.6em] max-w-[240px] text-center text-xs text-muted" aria-live="polite">
        {info.note}
      </p>
    </div>
  );
}
