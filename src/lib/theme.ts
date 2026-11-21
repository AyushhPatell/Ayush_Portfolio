import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : systemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(currentTheme());
    mq.addEventListener('change', onChange);
    // keep every hook instance in sync when the theme is toggled elsewhere
    const mo = new MutationObserver(onChange);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', onChange);
      mo.disconnect();
    };
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* storage blocked: theme still applies for this visit */
      }
      setTheme(next);
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
    else apply();
  }, []);

  return { theme, toggle };
}

/** Read the live colour tokens, for canvas drawing. */
export function readTokens() {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    ink: v('--ink'),
    muted: v('--muted'),
    line: v('--line'),
    bg: v('--bg'),
    software: v('--software'),
    data: v('--data'),
    ai: v('--ai'),
  };
}
