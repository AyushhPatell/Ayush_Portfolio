import { useState } from 'react';
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin } from 'lucide-react';
import { profile } from '../data/content';

export default function Contact({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(profile.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {
        /* clipboard blocked: the address is still visible and selectable */
      },
    );
  };

  const links = [
    { href: profile.linkedin, label: 'LinkedIn', icon: Linkedin },
    { href: profile.github, label: 'GitHub', icon: Github },
    { href: profile.resume, label: 'Resume (PDF)', icon: FileText },
  ];

  return (
    <section id="contact" className="border-t border-line bg-surface py-20 md:py-28">
      <div className="wrap">
        <p className="eyebrow">Contact</p>
        <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(40px,7vw,76px)] font-extrabold leading-[0.98]">
          Hiring? Let's talk.
        </h2>
        <p className="mt-5 max-w-[56ch] text-muted">
          I'm looking for full-time roles from May 2027 in software development, data and AI. Happy to walk you through ORBIT live.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 items-center rounded-xl border border-line bg-bg">
            <a href={`mailto:${profile.email}`} className="truncate px-4 py-3 font-mono text-[15px] sm:text-base">
              {profile.email}
            </a>
            <button
              onClick={copy}
              className="flex h-full items-center gap-2 border-l border-line px-4 py-3 text-sm font-semibold transition-colors hover:text-accent"
              aria-label="Copy email address"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          {links.map(({ href, label, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Icon size={16} /> {label} <ArrowUpRight size={14} className="text-muted" />
            </a>
          ))}
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
          <span>© {new Date().getFullYear()} Ayush Patel · Halifax, Nova Scotia</span>
          <button onClick={onOpenPalette} className="inline-flex items-center gap-2 hover:text-ink">
            Press <span className="kbd">⌘</span>
            <span className="kbd">K</span> to jump anywhere
          </button>
        </footer>
      </div>
    </section>
  );
}
