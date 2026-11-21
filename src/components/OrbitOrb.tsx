import { useEffect, useRef } from 'react';

// A web port of ORBIT's real orb (OrbitListeningHUDController.swift in the macOS app):
// neurons firing pulses inside a dark sphere, a glassy shell, arc rings and a particle cloud.
// The app has three states; the site uses the listening one.
type StateId = 'idle' | 'listening' | 'speaking';

// The app's "Arctic Sharp" palette
const C = {
  bg0: '0,5,8',
  bg1: '1,10,20',
  bg2: '0,4,6',
  nodeHi: '228,248,255',
  nodeLo: '80,168,238',
  pulseHead: '255,255,255',
  pulseTail: '100,200,255',
  conn: '40,108,195',
  fireGlow: '210,240,255',
  centerGlow: '60,148,238',
  accent: '120,205,255',
  particle: '100,188,255',
  shellMid: '200,235,255',
  shellEdge: '248,253,255',
};
const rgba = (c: string, a: number) => `rgba(${c},${Math.max(0, Math.min(1, a))})`;

interface Neuron { x: number; y: number; vx: number; vy: number; radius: number; firing: boolean; fireTime: number; connections: number[] }
interface Pulse { from: number; to: number; progress: number; speed: number; alpha: number }
interface Particle { angle: number; orbitRadius: number; size: number; angularSpeed: number; baseOpacity: number; driftPhase: number }

export default function OrbitOrb({ size = 200 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The orb always shows its listening look on the site.
  const stateRef = useRef<StateId>('listening');

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let dpr = 1;

    // simulation in a fixed 300-unit space, scaled to the element when drawn
    const SIZE = 300;
    const R = SIZE * 0.5 * 0.965;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const scale = SIZE / 220;
    let seed = 7;
    const rnd = (a = 0, b = 1) => a + (((seed = (seed * 16807) % 2147483647) - 1) / 2147483646) * (b - a);

    const neurons: Neuron[] = Array.from({ length: 24 }, () => ({
      x: CX + rnd(-0.5, 0.5) * SIZE * 0.44,
      y: CY + rnd(-0.5, 0.5) * SIZE * 0.44,
      vx: rnd(-0.2, 0.2),
      vy: rnd(-0.2, 0.2),
      radius: rnd(2.2, 5.4),
      firing: false,
      fireTime: 0,
      connections: [],
    }));
    neurons.forEach((n, i) => {
      n.connections = neurons
        .map((_, j) => j)
        .filter((j) => j !== i)
        .sort((a, b) => Math.hypot(neurons[a].x - n.x, neurons[a].y - n.y) - Math.hypot(neurons[b].x - n.x, neurons[b].y - n.y))
        .slice(0, 3);
    });
    let pulses: Pulse[] = [];
    const particles: Particle[] = Array.from({ length: 110 }, () => ({
      angle: rnd(0, Math.PI * 2),
      orbitRadius: SIZE * 0.5 * 1.065 + rnd(0, SIZE * 0.5 * 0.32),
      size: (0.75 + rnd(0, 2)) * 1.35,
      angularSpeed: rnd(-0.5, 0.5) * 0.004,
      baseOpacity: rnd(0.22, 0.72),
      driftPhase: rnd(0, Math.PI * 2),
    }));
    let lastFire = 0;
    let t = 0;

    const circle = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
    };
    const radial = (x: number, y: number, r0: number, r1: number, stops: [number, string][]) => {
      const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
      stops.forEach(([o, c]) => g.addColorStop(o, c));
      return g;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.width * dpr);
    };

    const render = (dt: number) => {
      const st = stateRef.current;
      const step = dt * 60; // the app advances its simulation per frame at 60fps
      const spd = st === 'idle' ? 0.2 : st === 'listening' ? 0.54 : 0.96;
      const fireRate = st === 'idle' ? 2.3 : st === 'listening' ? 0.68 : 0.22;

      const px = canvas.width / SIZE;
      ctx.setTransform(px, 0, 0, px, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);
      // the app's fitScale keeps the outer particles inside the frame
      ctx.translate(CX, CY);
      ctx.scale(0.68, 0.68);
      ctx.translate(-CX, -CY);

      // halo
      const haloOp = st === 'listening' ? 0.27 : 0.13;
      ctx.fillStyle = radial(CX, CY, R * 0.74, R * 1.17, [[0, rgba(C.particle, 0)], [0.5, rgba(C.particle, haloOp)], [1, rgba(C.particle, 0)]]);
      circle(CX, CY, R * 1.17);
      ctx.fill();

      // arc rings
      const ringOp = st === 'idle' ? 0.2 : st === 'listening' ? 0.58 : 0.38;
      const ringSpeed = st === 'idle' ? 0.3 : st === 'listening' ? 0.96 : 1.88;
      const base = t * ringSpeed;
      const rings: [number, number, number, number, number][] = [
        [base, R + 23 * scale, 0, Math.PI * 0.9, 1.5],
        [-base * 1.7, R + 40 * scale, Math.PI * 0.3, Math.PI * 1.74, 1.0],
        [base * 0.65, R + 55 * scale, 0.1, Math.PI * 1.24, 0.7],
      ];
      ctx.strokeStyle = rgba(C.accent, ringOp);
      for (const [rot, rad, a0, a1, lw] of rings) {
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(CX, CY, rad, a0 + rot, a1 + rot);
        ctx.stroke();
      }

      // interior
      ctx.save();
      circle(CX, CY, R);
      ctx.clip();
      ctx.fillStyle = radial(CX, CY, 0, R, [[0, `rgb(${C.bg0})`], [0.52, `rgb(${C.bg1})`], [1, `rgb(${C.bg2})`]]);
      ctx.fillRect(0, 0, SIZE, SIZE);

      const maxDist = R * 0.84;
      for (const n of neurons) {
        n.x += n.vx * spd * step;
        n.y += n.vy * spd * step;
        const dx = n.x - CX;
        const dy = n.y - CY;
        const d = Math.hypot(dx, dy);
        if (d > maxDist) {
          n.vx -= (dx / d) * 0.055 * step;
          n.vy -= (dy / d) * 0.055 * step;
        }
      }

      if (t - lastFire > fireRate * (0.65 + Math.random() * 0.7)) {
        lastFire = t;
        const src = Math.floor(Math.random() * neurons.length);
        for (const j of neurons[src].connections) {
          pulses.push({ from: src, to: j, progress: 0, speed: 0.014 + Math.random() * 0.022, alpha: 0.85 + Math.random() * 0.15 });
        }
        neurons[src].firing = true;
        neurons[src].fireTime = t;
      }

      ctx.lineWidth = 0.9;
      for (const n of neurons) {
        for (const j of n.connections) {
          const m = neurons[j];
          const d = Math.hypot(m.x - n.x, m.y - n.y);
          if (d < R * 0.95) {
            ctx.strokeStyle = rgba(C.conn, (1 - d / (R * 0.95)) * 0.14 * 1.75);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      const speedMult = st === 'speaking' ? 2.6 : st === 'listening' ? 1.58 : 1;
      const kept: Pulse[] = [];
      for (const p of pulses) {
        p.progress += p.speed * speedMult * step;
        if (p.progress >= 1) {
          neurons[p.to].firing = true;
          neurons[p.to].fireTime = t;
          continue;
        }
        kept.push(p);
        const n = neurons[p.from];
        const m = neurons[p.to];
        for (let tr = 0; tr < 9; tr++) {
          const tp = Math.max(0, p.progress - tr * 0.036);
          const a = p.alpha * (1 - tr / 9) * 0.8;
          ctx.fillStyle = rgba(p.progress < 0.5 ? C.pulseTail : C.pulseHead, a);
          circle(n.x + (m.x - n.x) * tp, n.y + (m.y - n.y) * tp, Math.max(0.3, 3.1 - tr * 0.28));
          ctx.fill();
        }
        ctx.fillStyle = rgba(C.pulseHead, p.alpha);
        circle(n.x + (m.x - n.x) * p.progress, n.y + (m.y - n.y) * p.progress, 3.5);
        ctx.fill();
      }
      pulses = kept;

      for (const n of neurons) {
        const fired = n.firing && t - n.fireTime < 0.44;
        const fa = fired ? Math.max(0, 1 - (t - n.fireTime) / 0.44) : 0;
        if (fired) {
          ctx.fillStyle = radial(n.x, n.y, 0, 20, [[0, rgba(C.fireGlow, fa * 0.94)], [0.45, rgba(C.fireGlow, fa * 0.34)], [1, rgba(C.fireGlow, 0)]]);
          circle(n.x, n.y, 20);
          ctx.fill();
        }
        const nr = n.radius * 1.28 * (1 + fa * 0.58);
        const col = fired ? C.nodeHi : C.nodeLo;
        ctx.fillStyle = radial(n.x, n.y, 0, nr, [[0, rgba(col, 0.8 + fa * 0.2)], [1, rgba(col, 0)]]);
        circle(n.x, n.y, nr);
        ctx.fill();
      }

      const cgR = 52 * scale;
      ctx.fillStyle = radial(CX, CY, 0, cgR, [[0, rgba(C.centerGlow, st === 'speaking' ? 0.44 : 0.22)], [1, rgba(C.centerGlow, 0)]]);
      circle(CX, CY, cgR);
      ctx.fill();
      ctx.restore();

      // glassy shell
      ctx.fillStyle = radial(CX, CY, R * 0.6, R, [
        [0, rgba(C.shellMid, 0)],
        [0.68, rgba(C.shellMid, 0.42)],
        [0.86, rgba(C.shellEdge, 0.86)],
        [1, 'rgba(255,255,255,0.96)'],
      ]);
      circle(CX, CY, R);
      ctx.fill();

      // particle cloud
      const om = st === 'idle' ? 0.5 : st === 'listening' ? 1.58 : 1.02;
      const pm = st === 'idle' ? 0.3 : st === 'listening' ? 1.38 : 0.84;
      const spr = st === 'listening' ? 1.27 : 1;
      for (const pt of particles) {
        const ang = pt.angle + pt.angularSpeed * pm * t * 60;
        const wb = st === 'listening' ? Math.sin(t * 2.5 + pt.driftPhase) * 16 : st === 'speaking' ? Math.sin(t * 5 + pt.driftPhase) * 9 : Math.sin(t * 0.8 + pt.driftPhase) * 4;
        const pr = (pt.orbitRadius + wb) * spr;
        ctx.fillStyle = rgba(C.particle, pt.baseOpacity * om * (0.6 + Math.sin(t * 1.2 + pt.driftPhase) * 0.4));
        circle(CX + Math.cos(ang) * pr, CY + Math.sin(ang) * pr, pt.size);
        ctx.fill();
      }

      if (st === 'speaking') {
        for (let i = 0; i < 3; i++) {
          const ph = (t * 1.65 + i * 0.48) % 1.56;
          ctx.strokeStyle = rgba(C.accent, (1 - ph / 1.56) * 0.48);
          ctx.lineWidth = Math.max(0.1, 1.6 - ph * 0.7);
          circle(CX, CY, R + ph * 60 * scale);
          ctx.stroke();
        }
      }
      if (st === 'listening') {
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + t * 0.57;
          const dr = R + (13 + Math.sin(t * 2 + i) * 5) * scale;
          ctx.fillStyle = rgba(C.accent, 0.34 + Math.sin(t * 2.5 + i * 1.22) * 0.24);
          circle(CX + Math.cos(a) * dr, CY + Math.sin(a) * dr, 3 * scale);
          ctx.fill();
        }
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      render(dt);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (reduce) render(0);
      else raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      render(0);
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

  return (
    <div className="mx-auto aspect-square w-full" style={{ maxWidth: size }}>
      <canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label="ORBIT's orb, animated" />
    </div>
  );
}
