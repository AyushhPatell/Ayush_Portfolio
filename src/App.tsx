import { useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import About from './components/About';
import Contact from './components/Contact';
import CommandPalette from './components/CommandPalette';
import { projects } from './data/content';

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [project, setProject] = useState(projects[0].id);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const selectProject = useCallback((id: string) => setProject(id), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-bg">
        Skip to work
      </a>
      <Nav onOpenPalette={openPalette} />
      <main>
        <Hero onOpenPalette={openPalette} />
        <Projects selected={project} onSelect={selectProject} />
        <Experience />
        <About />
        <Contact onOpenPalette={openPalette} />
      </main>
      <CommandPalette open={paletteOpen} onClose={closePalette} onSelectProject={selectProject} />
    </>
  );
}
