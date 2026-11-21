import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Copy, FileText, Github, Hash, Linkedin, Moon, Search } from 'lucide-react';
import { profile, projects } from '../data/content';
import { useTheme } from '../lib/theme';

interface Action {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number }>;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectProject: (id: string) => void;
}

const go = (hash: string) => {
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', hash);
};

export default function CommandPalette({ open, onClose, onSelectProject }: Props) {
  const { toggle } = useTheme();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(
    () => [
      { id: 'work', group: 'Go to', label: 'Work', icon: Hash, run: () => go('#work') },
      { id: 'exp', group: 'Go to', label: 'Experience', icon: Hash, run: () => go('#experience') },
      { id: 'about', group: 'Go to', label: 'About & how I build', icon: Hash, run: () => go('#about') },
      { id: 'contact', group: 'Go to', label: 'Contact', icon: Hash, run: () => go('#contact') },
      ...projects.map((p) => ({
        id: 'p-' + p.id,
        group: 'Projects',
        label: p.name,
        hint: p.tagline,
        icon: ArrowRight,
        run: () => {
          onSelectProject(p.id);
          go('#work');
        },
      })),
      {
        id: 'email',
        group: 'Contact',
        label: 'Copy email address',
        hint: profile.email,
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => setToast('Email copied'),
            () => setToast(profile.email),
          );
        },
      },
      { id: 'li', group: 'Contact', label: 'Open LinkedIn', icon: Linkedin, run: () => window.open(profile.linkedin, '_blank', 'noopener') },
      { id: 'gh', group: 'Contact', label: 'Open GitHub', icon: Github, run: () => window.open(profile.github, '_blank', 'noopener') },
      { id: 'cv', group: 'Contact', label: 'Open resume (PDF)', icon: FileText, run: () => window.open(profile.resume, '_blank', 'noopener') },
      { id: 'theme', group: 'Settings', label: 'Toggle light / dark mode', icon: Moon, run: toggle },
    ],
    [onSelectProject, toggle],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => (a.label + ' ' + (a.hint ?? '') + ' ' + a.group).toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  const close = () => {
    setQuery('');
    setIndex(0);
    onClose();
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const runAt = (i: number) => {
    const a = filtered[i];
    if (!a) return;
    close();
    // let the dialog close before scrolling
    setTimeout(a.run, 60);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(index);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  let lastGroup = '';

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} aria-hidden="true" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="card relative w-full max-w-[560px] overflow-hidden"
              style={{ boxShadow: 'var(--shadow)' }}
              initial={{ y: -8, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onKeyDown={onKey}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search size={16} className="shrink-0 text-muted" />
                <input
                  id="palette-search"
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  placeholder="Jump to a section, open a project, copy my email…"
                  className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[index] ? 'cmd-' + filtered[index].id : undefined}
                />
                <span className="kbd hidden sm:inline">esc</span>
              </div>
              <ul id="palette-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
                {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches for "{query}"</li>}
                {filtered.map((a, i) => {
                  const header = a.group !== lastGroup ? a.group : null;
                  lastGroup = a.group;
                  const Icon = a.icon;
                  return (
                    <li key={a.id} role="presentation">
                      {header && <div className="eyebrow px-3 pb-1 pt-3 text-[11px]">{header}</div>}
                      <div
                        id={'cmd-' + a.id}
                        role="option"
                        aria-selected={i === index}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => runAt(i)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                        style={i === index ? { background: 'var(--surface-2)' } : undefined}
                      >
                        <span className="text-muted">
                          <Icon size={15} />
                        </span>
                        <span className="font-medium">{a.label}</span>
                        {a.hint && <span className="ml-auto hidden truncate pl-4 text-xs text-muted sm:block">{a.hint}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-xs text-muted">
                <span>
                  <span className="kbd">↑</span> <span className="kbd">↓</span> to move
                </span>
                <span>
                  <span className="kbd">↵</span> to open
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
