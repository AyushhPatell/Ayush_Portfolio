import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Lightbulb, RotateCcw, Undo2 } from 'lucide-react';
import { slide, solve, solved, wallSet, type Dir, type Level, type Pos } from '../lib/tilt';

const blockColor = (color: string | null) => (color === 'a' ? 'var(--ai)' : color === 'b' ? 'var(--data)' : 'var(--muted)');

export default function TiltPuzzle({ level }: { level: Level }) {
  const walls = useMemo(() => wallSet(level), [level]);
  const par = useMemo(() => solve(level)?.length ?? 0, [level]);
  const [history, setHistory] = useState<Pos[][]>([level.start]);
  const [swipes, setSwipes] = useState(0);
  const [playing, setPlaying] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const pos = history[history.length - 1];
  const done = solved(level, pos);

  const move = (d: Dir) => {
    if (done) return;
    const next = slide(level, walls, pos, d);
    if (next.every((p, i) => p[0] === pos[i][0] && p[1] === pos[i][1])) return; // nothing moved
    setHistory((h) => [...h, next]);
    setSwipes((s) => s + 1);
  };
  const moveRef = useRef(move);
  useEffect(() => {
    moveRef.current = move;
  });

  const undo = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h)); // never refunds a swipe
  const restart = () => setHistory([level.start]);
  const reset = () => {
    setHistory([level.start]);
    setSwipes(0);
  };

  // Play the solver's answer from the current position, one swipe at a time.
  const showSolution = () => {
    const path = solve(level, pos);
    if (!path || playing) return;
    setPlaying(true);
    path.forEach((d, i) =>
      setTimeout(() => {
        moveRef.current(d);
        if (i === path.length - 1) setPlaying(false);
      }, 420 * (i + 1)),
    );
  };

  // Keyboard: arrows or WASD while the board has focus.
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
    };
    const d = map[e.key];
    if (d && !playing) {
      e.preventDefault();
      move(d);
    }
  };

  // Swipe on touch or drag with a mouse.
  useEffect(() => {
    const el = boardRef.current!;
    let sx = 0;
    let sy = 0;
    let down = false;
    const start = (e: PointerEvent) => {
      down = true;
      sx = e.clientX;
      sy = e.clientY;
    };
    const end = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      moveRef.current(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
    };
    el.addEventListener('pointerdown', start);
    window.addEventListener('pointerup', end);
    return () => {
      el.removeEventListener('pointerdown', start);
      window.removeEventListener('pointerup', end);
    };
  }, []);

  const stars = swipes <= par ? 3 : swipes <= par + 2 ? 2 : 1;
  const cell = 100 / level.size;

  const wallEls: React.ReactNode[] = [];
  level.walls.forEach((w) => {
    const [r, c, d] = w.split(',');
    const R = +r;
    const C = +c;
    const style: React.CSSProperties =
      d === 'up' || d === 'down'
        ? { left: `${C * cell}%`, top: `${(d === 'up' ? R : R + 1) * cell}%`, width: `${cell}%`, height: 4, transform: 'translateY(-50%)' }
        : { top: `${R * cell}%`, left: `${(d === 'left' ? C : C + 1) * cell}%`, height: `${cell}%`, width: 4, transform: 'translateX(-50%)' };
    wallEls.push(<div key={w} className="absolute z-10 rounded-full bg-ink" style={style} />);
  });

  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,300px)_1fr] sm:items-start">
      <div>
        <div
          ref={boardRef}
          tabIndex={0}
          onKeyDown={onKey}
          role="application"
          aria-label={`Puzzle board. Use the arrow keys or swipe. ${swipes} swipes so far, par is ${par}.${done ? ' Solved.' : ''}`}
          className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-xl border-2 border-ink bg-surface-2"
        >
          {/* grid */}
          {Array.from({ length: level.size * level.size }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-line"
              style={{ left: `${(i % level.size) * cell}%`, top: `${Math.floor(i / level.size) * cell}%`, width: `${cell}%`, height: `${cell}%` }}
            />
          ))}
          {/* targets */}
          {level.blocks.map((b) => {
            const t = level.targets[b.id];
            if (!t) return null;
            return (
              <div
                key={'t' + b.id}
                className="absolute flex items-center justify-center"
                style={{ left: `${t[1] * cell}%`, top: `${t[0] * cell}%`, width: `${cell}%`, height: `${cell}%` }}
              >
                <div className="h-[58%] w-[58%] rounded-md border-[3px] border-dashed" style={{ borderColor: blockColor(b.color) }} />
              </div>
            );
          })}
          {wallEls}
          {/* blocks */}
          {level.blocks.map((b, i) => (
            <motion.div
              key={b.id}
              className="absolute p-[7%]"
              style={{ width: `${cell}%`, height: `${cell}%` }}
              initial={false}
              animate={{ left: `${pos[i][1] * cell}%`, top: `${pos[i][0] * cell}%` }}
              transition={{ type: 'spring', stiffness: 520, damping: 38 }}
            >
              <div className="h-full w-full rounded-lg shadow-sm" style={{ background: blockColor(b.color) }} />
            </motion.div>
          ))}
          {done && (
            <motion.div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1 text-center"
              style={{ background: 'color-mix(in srgb, var(--bg) 78%, transparent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-2xl tracking-widest" aria-hidden="true">
                {'★'.repeat(stars)}
                <span className="opacity-25">{'★'.repeat(3 - stars)}</span>
              </div>
              <div className="font-display text-xl font-bold">Solved in {swipes}</div>
              <div className="text-sm text-muted">Par is {par}</div>
              <button onClick={reset} className="btn btn-primary mt-3 !py-2 text-sm">
                Play again
              </button>
            </motion.div>
          )}
        </div>
        {/* on-screen arrows */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {([
            ['up', ArrowUp],
            ['left', ArrowLeft],
            ['down', ArrowDown],
            ['right', ArrowRight],
          ] as const).map(([d, Icon]) => (
            <button
              key={d}
              onClick={() => move(d)}
              disabled={done || playing}
              className="btn btn-ghost justify-center !px-0 !py-2 disabled:opacity-40"
              aria-label={`Swipe ${d}`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <div className="flex gap-6">
          <div>
            <div className="eyebrow">Swipes</div>
            <div className="font-display text-3xl font-bold tabular-nums">{swipes}</div>
          </div>
          <div>
            <div className="eyebrow">Par</div>
            <div className="font-display text-3xl font-bold tabular-nums">{par}</div>
          </div>
        </div>
        <p className="text-sm text-muted">
          Get the <span className="font-semibold text-ai">coral</span> and <span className="font-semibold text-data">green</span> blocks onto
          their dashed squares. Every swipe moves <em>all</em> blocks until they hit a wall, the edge or each other. Click the board and use the
          arrow keys, or swipe.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={undo} disabled={history.length < 2 || done || playing} className="btn btn-ghost !py-2 text-sm disabled:opacity-40">
            <Undo2 size={14} /> Undo
          </button>
          <button onClick={restart} disabled={history.length < 2 || done || playing} className="btn btn-ghost !py-2 text-sm disabled:opacity-40">
            <RotateCcw size={14} /> Restart
          </button>
          <button onClick={showSolution} disabled={done || playing} className="btn btn-ghost !py-2 text-sm disabled:opacity-40">
            <Lightbulb size={14} /> Show me
          </button>
        </div>
        <p className="text-xs text-muted">Like the real game, undo and restart never give swipes back.</p>
      </div>
    </div>
  );
}
