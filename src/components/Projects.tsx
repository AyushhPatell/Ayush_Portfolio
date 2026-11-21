import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import { demoLevel, orbits, projects, type OrbitId } from '../data/content';
import ArchDiagram from './ArchDiagram';
import TiltPuzzle from './TiltPuzzle';
import OrbitOrb from './OrbitOrb';
import SectionHead from './SectionHead';

const colorVar: Record<OrbitId, string> = { software: 'var(--software)', data: 'var(--data)', ai: 'var(--ai)' };
const label = (id: OrbitId) => orbits.find((o) => o.id === id)!.label;

export default function Projects({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const p = projects.find((x) => x.id === selected) ?? projects[0];
  const main = colorVar[p.areas[0]];

  return (
    <section id="work" className="py-20 md:py-28">
      <div className="wrap">
        <SectionHead
          eyebrow="Selected work"
          title="Things I've built"
          intro="Pick a project. The diagrams are live: click any part to see what it does. Dayblock you can play."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          {/* project list */}
          <div
            role="tablist"
            aria-label="Projects"
            aria-orientation="vertical"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {projects.map((x, i) => {
              const on = x.id === p.id;
              return (
                <button
                  key={x.id}
                  role="tab"
                  id={'tab-' + x.id}
                  aria-selected={on}
                  aria-controls="project-panel"
                  onClick={() => onSelect(x.id)}
                  className="group relative shrink-0 rounded-xl border px-4 py-3 text-left transition-colors lg:shrink"
                  style={{
                    borderColor: on ? 'var(--ink)' : 'var(--line)',
                    background: on ? 'var(--surface)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[17px] font-bold">{x.name}</span>
                    <span className="ml-auto hidden gap-1 lg:flex" aria-hidden="true">
                      {x.areas.map((a) => (
                        <span key={a} className="h-1.5 w-1.5 rounded-full" style={{ background: colorVar[a] }} />
                      ))}
                    </span>
                  </div>
                  <div className="mt-0.5 hidden pl-7 text-xs text-muted lg:block">{x.status}</div>
                </button>
              );
            })}
          </div>

          {/* detail */}
          <div id="project-panel" role="tabpanel" aria-labelledby={'tab-' + p.id} className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="card p-5 sm:p-8"
                style={{ boxShadow: 'var(--shadow)' }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {p.areas.map((a) => (
                    <span key={a} className="chip">
                      <span className="h-2 w-2 rounded-full" style={{ background: colorVar[a] }} />
                      {label(a)}
                    </span>
                  ))}
                  <span className="chip">{p.year}</span>
                  <span className="chip">{p.status}</span>
                </div>
                <div className={p.id === 'orbit' ? 'grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_240px]' : ''}>
                  <div className="min-w-0">
                    <h3 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">{p.name}</h3>
                    <p className="mt-2 font-display text-lg font-medium sm:text-xl">{p.tagline}</p>
                    <p className="mt-4 max-w-[65ch] text-muted">{p.summary}</p>
                  </div>
                  {p.id === 'orbit' && <OrbitOrb />}
                </div>

                {p.diagram && (
                  <div className="mt-7">
                    <div className="eyebrow mb-3">How it fits together</div>
                    <ArchDiagram nodes={p.diagram.nodes} edges={p.diagram.edges} color={main} />
                  </div>
                )}
                {p.demo === 'tilt' && (
                  <div className="mt-7">
                    <div className="eyebrow mb-3">Play today's sample puzzle</div>
                    <TiltPuzzle level={demoLevel} />
                  </div>
                )}

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <div className="eyebrow mb-3">What it does</div>
                    <ul className="space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-[15px]">
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: main }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="eyebrow mb-3">Built with</div>
                    <div className="flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {p.decisions.length > 0 && (
                  <div className="mt-8">
                    <div className="eyebrow mb-3">Key design decisions</div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {p.decisions.map((d) => (
                        <details key={d.title} className="group rounded-xl border border-line bg-surface-2 p-4 open:bg-surface">
                          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-semibold">
                            {d.title}
                            <span className="mono mt-0.5 text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                              +
                            </span>
                          </summary>
                          <p className="mt-2 text-sm text-muted">{d.body}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                  {p.links.map((l) =>
                    l.href ? (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-2.5 text-sm">
                        {l.label} <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <span key={l.label} className="inline-flex items-center gap-2 text-sm text-muted">
                        <Lock size={14} /> {l.label}
                      </span>
                    ),
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
