import { useEffect, useState } from 'react';
import { Command, Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        background: scrolled ? 'color-mix(in srgb, var(--bg) 82%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
      }}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-4" aria-label="Main">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          Ayush Patel
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="mr-2 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={onOpenPalette}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-muted transition-colors hover:text-ink"
            aria-label="Open command menu"
          >
            <Command size={14} />
            <span className="md:hidden">Menu</span>
            <span className="hidden md:inline">K</span>
          </button>
          <button
            onClick={toggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
      <div
        className="absolute bottom-[-1px] left-0 h-[2px] bg-accent"
        style={{ width: `${progress * 100}%`, opacity: scrolled ? 1 : 0 }}
        aria-hidden="true"
      />
    </header>
  );
}
