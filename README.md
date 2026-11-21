# ayushp-portfolio

My personal site: [ayushp-portfolio.netlify.app](https://ayushp-portfolio.netlify.app)

A single page with my projects, experience and contact details. Built to load fast and stay readable, with a few interactive pieces:

- **Orbit hero:** a small canvas animation with three rings (software, data, AI). Hover or tap a ring to see what I do in that area.
- **Live architecture diagrams:** click any part of ORBIT or the Expense Tracker to see what it does.
- **Playable Dayblock puzzle:** a sample level from my iOS game, with a breadth-first solver that finds par and can play the solution.
- **Command menu:** press `⌘K` / `Ctrl+K` to jump anywhere, open a project or copy my email.
- Light and dark mode, keyboard accessible, respects reduced-motion settings.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide icons. No 3D or analytics libraries.

## Run it

```bash
npm install
npm run dev
```

## Where things live

| Path | What |
|---|---|
| `src/data/content.ts` | All text: projects, jobs, the "Now" list. Edit this to update the site. |
| `src/lib/tilt.ts` | Puzzle rules and the solver |
| `src/components/` | One file per section |
| `public/Resume.pdf` | The resume the site links to |
