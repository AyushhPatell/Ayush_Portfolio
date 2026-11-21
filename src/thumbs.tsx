// Temporary render page for LinkedIn thumbnails and the site's link preview (1200x627).
/* eslint-disable react-refresh/only-export-components -- a standalone render page, not part of the app */
import { createRoot } from 'react-dom/client';
import './index.css';
import OrbitOrb from './components/OrbitOrb';
import OrbitCanvas from './components/OrbitCanvas';
import { demoLevel } from './data/content';

const card = new URLSearchParams(location.search).get('card') ?? 'site';

function Frame({ eyebrow, title, sub, chips, children, color }: {
  eyebrow: string; title: string; sub: string; chips: string[]; children: React.ReactNode; color: string;
}) {
  return (
    <div className="relative flex h-[627px] w-[1200px] overflow-hidden bg-bg text-ink">
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.16] blur-3xl" style={{ background: color }} />
      <div className="relative z-10 flex w-[560px] flex-col justify-between py-16 pl-20">
        <div>
          <p className="eyebrow !text-[15px]">{eyebrow}</p>
          <h1 className="mt-5 font-display text-[86px] font-extrabold leading-[0.95]">{title}</h1>
          <p className="mt-6 max-w-[440px] font-display text-[30px] font-medium leading-snug">{sub}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {chips.map((c) => (
            <span key={c} className="chip !px-3.5 !py-1.5 !text-[15px]">{c}</span>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex flex-1 items-center justify-center pr-16">{children}</div>
      <div className="absolute bottom-0 left-0 h-[6px] w-full" style={{ background: color }} />
    </div>
  );
}

function Orbit() {
  return (
    <Frame eyebrow="Ayush Patel · Project" title="ORBIT" sub="A personal AI companion that lives on my Mac." chips={['Swift', 'Python', 'FastAPI', 'Local LLM']} color="var(--ai)">
      <div className="w-[520px]"><OrbitOrb size={520} /></div>
    </Frame>
  );
}

function Expense() {
  const steps = ['Bank CSVs', 'Clean', 'De-dupe', 'SQLite', 'Dashboard'];
  const bars = [['Groceries', 78], ['Rent', 100], ['Transit', 34], ['Dining', 52], ['Shopping', 41], ['Bills', 63]] as const;
  return (
    <Frame eyebrow="Ayush Patel · Project" title="Expense Tracker" sub="Private, local-only finance from real bank exports." chips={['Python', 'Streamlit', 'SQLite', 'pytest']} color="var(--data)">
      <div className="w-[540px] rounded-2xl border border-line bg-surface p-7">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className="whitespace-nowrap rounded-lg border px-2 py-1.5 font-mono text-[12.5px]" style={{ borderColor: i === 2 ? 'var(--data)' : 'var(--line)', background: i === 2 ? 'var(--data)' : 'transparent', color: i === 2 ? 'var(--bg)' : 'var(--ink)' }}>{s}</span>
              {i < steps.length - 1 && <span className="text-[13px] text-muted">→</span>}
            </span>
          ))}
        </div>
        <p className="eyebrow mt-8">Spending by category · sample data</p>
        <div className="mt-4 space-y-3">
          {bars.map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-24 text-[14px] text-muted">{k}</span>
              <span className="h-4 rounded-full bg-data" style={{ width: `${v * 3.4}px`, opacity: 0.35 + v / 160 }} />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Dayblock() {
  const cell = 52;
  const color = (c: string | null) => (c === 'a' ? 'var(--ai)' : c === 'b' ? 'var(--data)' : 'var(--muted)');
  return (
    <Frame eyebrow="Ayush Patel · iOS game" title="Dayblock" sub="One sliding-block puzzle a day. Beat par." chips={['Swift', 'SwiftUI', 'Solver', 'XCTest']} color="var(--software)">
      <div className="relative rounded-[48px] border-[10px] border-[#2a3340] bg-surface px-6 pb-16 pt-20">
        <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-[#2a3340]" />
        <div className="mb-4 flex justify-between font-mono text-[13px] text-muted"><span>SWIPES 3</span><span>PAR 5</span></div>
        <div className="relative rounded-xl border-2 border-ink bg-surface-2" style={{ width: cell * 5, height: cell * 5 }}>
          {demoLevel.blocks.map((b) => {
            const t = demoLevel.targets[b.id];
            return t ? <div key={'t' + b.id} className="absolute rounded-md border-[3px] border-dashed" style={{ left: t[1] * cell + 12, top: t[0] * cell + 12, width: cell - 24, height: cell - 24, borderColor: color(b.color) }} /> : null;
          })}
          {demoLevel.walls.map((w) => {
            const [r, c, d] = w.split(',');
            const st: React.CSSProperties = d === 'up' || d === 'down'
              ? { left: +c * cell, top: (d === 'up' ? +r : +r + 1) * cell - 2, width: cell, height: 4 }
              : { top: +r * cell, left: (d === 'left' ? +c : +c + 1) * cell - 2, height: cell, width: 4 };
            return <div key={w} className="absolute rounded-full bg-ink" style={st} />;
          })}
          {[[1, 3, 'a'], [3, 3, 'b'], [4, 1, null]].map(([r, c, col], i) => (
            <div key={i} className="absolute rounded-lg" style={{ left: (c as number) * cell + 5, top: (r as number) * cell + 5, width: cell - 10, height: cell - 10, background: color(col as string | null) }} />
          ))}
        </div>
        <div className="mt-5 text-center text-[22px] tracking-widest">★★<span className="opacity-25">★</span></div>
      </div>
    </Frame>
  );
}

function Kachuful() {
  const cards = [['A', '♠', false], ['K', '♥', true], ['Q', '♦', true], ['J', '♣', false], ['10', '♥', true]] as const;
  return (
    <Frame eyebrow="Ayush Patel · Multiplayer game" title="Kachuful" sub="The card game, online. Join with a 6-digit code." chips={['React', 'Firebase', 'Firestore', 'Live']} color="var(--software)">
      <div className="relative h-[420px] w-[520px]">
        <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-line bg-surface px-5 py-2 font-mono text-[18px]">TABLE · 482 913</div>
        {cards.map(([v, s, red], i) => (
          <div
            key={i}
            className="absolute flex h-[210px] w-[146px] flex-col justify-between rounded-2xl border border-[#d9dde3] bg-white p-3 shadow-2xl"
            style={{ left: 40 + i * 78, top: 130 + Math.abs(i - 2) * 14, transform: `rotate(${(i - 2) * 8}deg)`, color: red ? '#d1352b' : '#111' }}
          >
            <span className="font-display text-[30px] font-bold leading-none">{v}<br />{s}</span>
            <span className="self-end text-[52px] leading-none">{s}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Codebrief() {
  return (
    <Frame eyebrow="Ayush Patel · AI tool" title="codebrief" sub="Point it at any codebase. Get a plain-English explanation." chips={['Python', 'OpenAI API', 'CLI']} color="var(--ai)">
      <div className="w-[560px] overflow-hidden rounded-2xl border border-line bg-[#05070a] font-mono text-[15px] leading-relaxed">
        <div className="flex gap-2 border-b border-line px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="space-y-3 p-6 text-[#cfd6df]">
          <p><span className="text-data">$</span> python3 codebrief.py github.com/you/app</p>
          <p className="text-muted">Cloning… reading 14 key files…</p>
          <p className="text-ai">What it is</p>
          <p>A Streamlit app that imports bank CSV exports, removes duplicates and shows monthly spending.</p>
          <p className="text-ai">How it fits together</p>
          <p>core/importers parses each bank's format, core/db stores immutable raw rows, app/ renders the dashboard.</p>
        </div>
      </div>
    </Frame>
  );
}

function Site() {
  return (
    <div className="relative flex h-[627px] w-[1200px] items-center overflow-hidden bg-bg text-ink">
      <div className="relative z-10 w-[640px] pl-20">
        <p className="eyebrow !text-[15px]">Software · Data · AI · Halifax, NS</p>
        <h1 className="mt-5 font-display text-[96px] font-extrabold leading-[0.95]">Ayush Patel</h1>
        <p className="mt-7 font-display text-[36px] font-medium leading-snug">
          I build <span className="text-software">software</span>, <span className="text-data">data tools</span> and <span className="text-ai">AI systems</span> that people actually use.
        </p>
      </div>
      <div className="absolute right-6 top-1/2 h-[500px] w-[560px] -translate-y-1/2">
        <OrbitCanvas active="data" onHover={() => {}} onPick={() => {}} />
      </div>
      <div className="absolute bottom-0 left-0 flex h-[6px] w-full">
        <span className="flex-1 bg-software" /><span className="flex-1 bg-data" /><span className="flex-1 bg-ai" />
      </div>
    </div>
  );
}

const map: Record<string, () => React.ReactElement> = { orbit: Orbit, expense: Expense, dayblock: Dayblock, kachuful: Kachuful, codebrief: Codebrief, site: Site };
const Card = map[card] ?? Site;
createRoot(document.getElementById('root')!).render(<Card />);
