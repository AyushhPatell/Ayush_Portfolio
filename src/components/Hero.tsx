import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import OrbitCanvas from './OrbitCanvas';
import { orbits, profile, type OrbitId } from '../data/content';

const colorVar: Record<OrbitId, string> = {
  software: 'var(--software)',
  data: 'var(--data)',
  ai: 'var(--ai)',
};

export default function Hero({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [active, setActive] = useState<OrbitId>('software');
  const [hover, setHover] = useState<OrbitId | null>(null);
  const [touched, setTouched] = useState(false);

  // Cycle through the three orbits until the visitor takes over.
  useEffect(() => {
    if (touched) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setActive((a) => orbits[(orbits.findIndex((o) => o.id === a) + 1) % orbits.length].id);
    }, 3800);
    return () => window.clearInterval(id);
  }, [touched]);

  const onHover = useCallback((id: OrbitId | null) => {
    setHover(id);
    if (id) setTouched(true);
  }, []);
  const onPick = useCallback((id: OrbitId) => {
    setTouched(true);
    setActive(id);
  }, []);

  const shown = orbits.find((o) => o.id === (hover ?? active))!;

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="wrap grid items-center gap-10 pb-16 pt-28 md:pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-24">
        <motion.div
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="min-w-0"
        >
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-data opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-data" />
              </span>
              {profile.status}
            </span>
          </p>
          <h1 className="mt-5 font-display text-[clamp(44px,8vw,84px)] font-extrabold leading-[0.95]">
            Ayush Patel
          </h1>
          <p className="mt-6 max-w-[34ch] font-display text-[clamp(22px,3vw,30px)] font-medium leading-snug">
            I build{' '}
            <span className="text-software">software</span>,{' '}
            <span className="text-data">data tools</span> and{' '}
            <span className="text-ai">AI systems</span> that people actually use.
          </p>
          <p className="mt-5 max-w-[56ch] text-muted">
            Applied Computer Science at Dalhousie, graduating April 2027. Three co-ops across government and
            industry, now a Student Analytics Developer at Halifax Regional Municipality. Outside work I'm building
            ORBIT, a voice assistant for the Mac.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              See my work <ArrowDown size={16} />
            </a>
            <a href={profile.resume} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
              <FileText size={16} /> Resume
            </a>
            <button onClick={onOpenPalette} className="hidden items-center gap-2 text-sm text-muted hover:text-ink md:inline-flex">
              or press <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="min-w-0"
        >
          <div className="mx-auto aspect-[5/4] w-full max-w-[560px]">
            <OrbitCanvas active={active} onHover={onHover} onPick={onPick} />
          </div>
          <div className="mx-auto mt-2 max-w-[520px]">
            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Areas of work">
              {orbits.map((o) => {
                const on = (hover ?? active) === o.id;
                return (
                  <button
                    key={o.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => onPick(o.id)}
                    onMouseEnter={() => onHover(o.id)}
                    onMouseLeave={() => onHover(null)}
                    className="chip transition-colors"
                    style={on ? { borderColor: colorVar[o.id], color: 'var(--ink)' } : undefined}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: colorVar[o.id] }} />
                    {o.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 min-h-[3em] text-center text-sm text-muted" aria-live="polite">
              {shown.blurb}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
