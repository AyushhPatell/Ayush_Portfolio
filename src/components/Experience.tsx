import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { jobs } from '../data/content';
import SectionHead from './SectionHead';

export default function Experience() {
  const [open, setOpen] = useState(0);

  return (
    <section id="experience" className="border-y border-line bg-surface py-20 md:py-28">
      <div className="wrap">
        <SectionHead
          eyebrow="Experience"
          title="Where I've worked"
          intro="Three co-ops in government and industry, plus two part-time jobs at Dalhousie while studying."
        />
        <ol className="mt-10 border-t border-line">
          {jobs.map((j, i) => {
            const on = open === i;
            return (
              <li key={j.org + j.role} className="border-b border-line">
                <button
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  aria-controls={'job-' + i}
                  className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-5 text-left md:grid-cols-[170px_1fr_auto]"
                >
                  <span className="mono col-span-2 text-xs text-muted md:col-span-1 md:text-sm">{j.when}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-bold transition-colors group-hover:text-accent sm:text-2xl">{j.role}</span>
                    <span className="block text-sm text-muted">
                      {j.org} · {j.where} · {j.kind}
                    </span>
                  </span>
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-300"
                    style={{ transform: on ? 'rotate(45deg)' : 'none' }}
                    aria-hidden="true"
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={'job-' + i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 md:pl-[186px]">
                        <ul className="max-w-[70ch] space-y-2">
                          {j.points.map((pt) => (
                            <li key={pt} className="flex gap-3">
                              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {j.tags.map((t) => (
                            <span key={t} className="chip">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
