import { useState } from 'react';
import type { DiagramNode } from '../data/content';

interface Props {
  nodes: DiagramNode[];
  edges: [string, string][];
  color: string;
}

// Map 0..100 node coordinates into the padded drawing area.
const px = (x: number) => 7 + x * 0.86;
const py = (y: number) => 10 + y * 0.8;

export default function ArchDiagram({ nodes, edges, color }: Props) {
  const [sel, setSel] = useState(nodes[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? sel;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const current = byId[focus];
  const linked = new Set(edges.filter(([a, b]) => a === focus || b === focus).flat());

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-surface-2 sm:aspect-[16/8]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.25" fill="var(--line)" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          {edges.map(([a, b]) => {
            const A = byId[a];
            const B = byId[b];
            const on = a === focus || b === focus;
            return (
              <line
                key={a + b}
                x1={px(A.x)}
                y1={py(A.y)}
                x2={px(B.x)}
                y2={py(B.y)}
                stroke={on ? color : 'var(--muted)'}
                strokeOpacity={on ? 0.95 : 0.35}
                strokeWidth={on ? 2 : 1.2}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="4 5"
                className="flow"
              />
            );
          })}
        </svg>
        {nodes.map((n) => {
          const on = n.id === focus;
          const near = linked.has(n.id);
          return (
            <button
              key={n.id}
              onClick={() => setSel(n.id)}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setSel(n.id)}
              aria-pressed={n.id === sel}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-medium transition-all duration-200 sm:text-xs"
              style={{
                left: `${px(n.x)}%`,
                top: `${py(n.y)}%`,
                background: on ? color : 'var(--surface)',
                color: on ? 'var(--bg)' : 'var(--ink)',
                borderColor: on || near ? color : 'var(--line)',
                boxShadow: on ? `0 0 0 4px color-mix(in srgb, ${color} 22%, transparent)` : 'none',
              }}
            >
              {n.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex min-h-[3.5em] items-start gap-3 text-sm" aria-live="polite">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
        <p>
          <span className="font-semibold">{current.label}.</span> <span className="text-muted">{current.detail}</span>
        </p>
      </div>
    </div>
  );
}
