import { motion } from 'framer-motion';
import photo from '../assets/ayush.jpg';
import { howIBuild, now } from '../data/content';
import SectionHead from './SectionHead';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
          <motion.figure
            initial={{ opacity: 0, rotate: -2, y: 10 }}
            whileInView={{ opacity: 1, rotate: -1.5, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.01 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-[320px] rounded-2xl border border-line bg-surface p-3"
            style={{ boxShadow: 'var(--shadow)' }}
          >
            <img src={photo} alt="Ayush Patel" width={675} height={900} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
            <figcaption className="mono mt-3 flex justify-between px-1 text-xs text-muted">
              <span>Halifax, NS</span>
              <span>44.65° N, 63.58° W</span>
            </figcaption>
          </motion.figure>

          <div className="min-w-0">
            <SectionHead eyebrow="About" title="Hi, I'm Ayush." />
            <div className="mt-5 max-w-[62ch] space-y-4 text-[17px]">
              <p>
                I moved to Halifax in 2023 to study Applied Computer Science at Dalhousie. Since then I've supported staff at the Canada Revenue
                Agency, built internal tools for a manufacturer in New Glasgow, and now build analytics for Halifax Regional Municipality.
              </p>
              <p className="text-muted">
                What ties it together: I like taking something messy, whether that's a process, a pile of data or an idea, and turning it into a
                tool people actually open. When an idea won't leave me alone, I build it. That's how ORBIT, my expense tracker and Dayblock
                started.
              </p>
            </div>

            <div className="mt-12">
              <p className="eyebrow">How I build</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {howIBuild.map((h, i) => (
                  <motion.div
                    key={h.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-xl border border-line bg-surface p-4"
                  >
                    <h3 className="font-display text-lg font-bold">{h.title}</h3>
                    <p className="mt-2 text-sm text-muted">{h.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-dashed border-line p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="eyebrow">Now</p>
                <p className="mono text-xs text-muted">Updated {now.updated}</p>
              </div>
              <ul className="mt-4 space-y-2.5">
                {now.items.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mono text-accent" aria-hidden="true">
                      →
                    </span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
