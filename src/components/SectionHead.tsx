import { motion } from 'framer-motion';

export default function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="max-w-[640px]"
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.05]">{title}</h2>
      {intro && <p className="mt-4 text-muted">{intro}</p>}
    </motion.div>
  );
}
