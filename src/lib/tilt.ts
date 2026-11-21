// A tiny engine for a Dayblock-style "Tilt" puzzle.
// One swipe slides every block until it hits the edge, a wall, or another block.

export type Dir = 'up' | 'down' | 'left' | 'right';
export type Pos = [number, number]; // [row, col]

export interface Block {
  id: string;
  color: string | null; // null = grey block with no target
}

export interface Level {
  size: number;
  walls: string[]; // "r,c,dir" — a wall on that side of cell (r,c)
  blocks: Block[];
  start: Pos[]; // same order as blocks
  targets: Record<string, Pos>; // block id -> target cell
}

const DELTA: Record<Dir, Pos> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
const OPP: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function wallSet(level: Level): Set<string> {
  const s = new Set<string>();
  for (const w of level.walls) {
    const [r, c, d] = w.split(',');
    const dir = d as Dir;
    s.add(`${r},${c},${dir}`);
    const [dr, dc] = DELTA[dir];
    s.add(`${+r + dr},${+c + dc},${OPP[dir]}`);
  }
  return s;
}

export function slide(level: Level, walls: Set<string>, pos: Pos[], dir: Dir): Pos[] {
  const [dr, dc] = DELTA[dir];
  const order = pos.map((_, i) => i).sort((a, b) => {
    // leading blocks move first
    const ka = pos[a][0] * dr + pos[a][1] * dc;
    const kb = pos[b][0] * dr + pos[b][1] * dc;
    return kb - ka;
  });
  const next = pos.map((p) => [p[0], p[1]] as Pos);
  const occupied = new Set(next.map((p) => `${p[0]},${p[1]}`));
  for (const i of order) {
    let [r, c] = next[i];
    occupied.delete(`${r},${c}`);
    for (;;) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= level.size || nc >= level.size) break;
      if (walls.has(`${r},${c},${dir}`)) break;
      if (occupied.has(`${nr},${nc}`)) break;
      r = nr;
      c = nc;
    }
    next[i] = [r, c];
    occupied.add(`${r},${c}`);
  }
  return next;
}

export function solved(level: Level, pos: Pos[]): boolean {
  return level.blocks.every((b, i) => {
    const t = level.targets[b.id];
    return !t || (t[0] === pos[i][0] && t[1] === pos[i][1]);
  });
}

const key = (pos: Pos[]) => pos.map((p) => p.join(',')).join('|');

/** Breadth-first search for the fewest swipes. Returns the move list, or null. */
export function solve(level: Level, from: Pos[] = level.start, maxDepth = 14): Dir[] | null {
  const walls = wallSet(level);
  const dirs: Dir[] = ['up', 'right', 'down', 'left'];
  const seen = new Map<string, { prev: string | null; dir: Dir | null }>();
  let frontier: Pos[][] = [from];
  seen.set(key(from), { prev: null, dir: null });
  if (solved(level, from)) return [];
  for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
    const nextFrontier: Pos[][] = [];
    for (const p of frontier) {
      for (const d of dirs) {
        const n = slide(level, walls, p, d);
        const k = key(n);
        if (seen.has(k)) continue;
        seen.set(k, { prev: key(p), dir: d });
        if (solved(level, n)) {
          const path: Dir[] = [];
          let cur: string | null = k;
          while (cur) {
            const node: { prev: string | null; dir: Dir | null } = seen.get(cur)!;
            if (node.dir) path.unshift(node.dir);
            cur = node.prev;
          }
          return path;
        }
        nextFrontier.push(n);
      }
    }
    frontier = nextFrontier;
  }
  return null;
}
