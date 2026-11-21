import type { Level } from '../lib/tilt';

export const profile = {
  name: 'Ayush Patel',
  place: 'Halifax, Nova Scotia',
  email: 'ayush.p@dal.ca',
  linkedin: 'https://www.linkedin.com/in/ayush-patel-dalcs/',
  github: 'https://github.com/AyushhPatell',
  resume: '/Resume.pdf',
  status: 'Open to full-time roles from May 2027',
};

/** The three orbits in the hero. Each ring is one side of the work. */
export const orbits = [
  {
    id: 'software',
    label: 'Software',
    blurb: 'Apps people actually open: macOS, iOS, web and internal tools.',
    items: ['Swift', 'TypeScript', 'React', 'Java', 'FastAPI', 'Git'],
  },
  {
    id: 'data',
    label: 'Data',
    blurb: 'Getting data out of messy systems, cleaning it and turning it into decisions.',
    items: ['SQL', 'Python', 'Power BI', 'SQLite', 'SAP', 'ETL'],
  },
  {
    id: 'ai',
    label: 'AI',
    blurb: 'Assistants that remember, use tools and run on your own machine.',
    items: ['LLM APIs', 'Tool calling', 'Local models', 'Memory & recall', 'Prompt design'],
  },
] as const;

export type OrbitId = (typeof orbits)[number]['id'];

export interface DiagramNode {
  id: string;
  label: string;
  x: number; // 0..100
  y: number; // 0..100
  detail: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  year: string;
  status: string;
  areas: OrbitId[];
  stack: string[];
  summary: string;
  highlights: string[];
  decisions: { title: string; body: string }[];
  diagram?: { nodes: DiagramNode[]; edges: [string, string][] };
  links: { label: string; href: string | null }[];
  demo?: 'tilt';
}

export const projects: Project[] = [
  {
    id: 'orbit',
    name: 'ORBIT',
    tagline: 'A personal AI companion that lives on my Mac. It remembers, notices and acts.',
    year: '2026 – now',
    status: 'In active development',
    areas: ['ai', 'software', 'data'],
    stack: ['Swift', 'Python', 'FastAPI', 'MLX', 'Embeddings', 'GitHub Actions'],
    summary:
      'ORBIT is my long-running project: an AI companion with its own character, not just a command box. It learns my habits, remembers what matters, and is learning when to speak up and when to stay quiet. A native Swift app handles voice and the screen. A Python backend handles memory, judgment and the language model, which can run locally on Apple silicon.',
    highlights: [
      'Talk to it hands-free: wake word, push-to-talk and continuous conversation',
      'Acts across the Mac: system settings, files, browsers, music, notes, messages and more, with new skills added as it grows',
      'Long-term memory that learns my habits and preferences',
      'A character that stays the same while its judgment matures over time',
    ],
    decisions: [
      {
        title: 'The model answers, the code decides',
        body: 'The language model can suggest and word things, but it never makes a decision on its own. ORBIT’s code turns its answers into actions, so behaviour stays predictable and testable.',
      },
      {
        title: 'A version handshake between the app and the backend',
        body: 'Updating one half without the other used to break tool calls silently. Now both sides share a protocol version, and a mismatch shows a plain-language notice instead.',
      },
      {
        title: 'Shadow mode before it is allowed to speak up',
        body: 'Every five minutes ORBIT decides what it would raise on its own, and only logs it. I study those logs before letting it interrupt anyone.',
      },
    ],
    diagram: {
      nodes: [
        { id: 'voice', label: 'Voice', x: 8, y: 50, detail: 'Wake word, push-to-talk and speech. Pauses are timed by how the sentence ends, so "and…" gets more time.' },
        { id: 'app', label: 'Swift app', x: 30, y: 50, detail: 'The native macOS app: UI, microphone, text-to-speech and system controls.' },
        { id: 'api', label: '/chat API', x: 52, y: 50, detail: 'One FastAPI contract between app and backend, guarded by a shared protocol version.' },
        { id: 'llm', label: 'Model', x: 76, y: 20, detail: 'A language model, local through MLX on Apple silicon or in the cloud, with tool calling.' },
        { id: 'tools', label: 'Tools', x: 92, y: 50, detail: 'Skills ORBIT can use: system settings, files, browsers, music, notes and messages. The code, not the model, decides when to use them.' },
        { id: 'memory', label: 'Memory', x: 76, y: 80, detail: 'Long-term store with embedding recall. Near-identical memories (≥0.92 cosine) are dropped and back-filled.' },
        { id: 'tick', label: 'Tick loop', x: 52, y: 86, detail: 'A background loop that decides what it would say on its own, logged in shadow mode for now.' },
      ],
      edges: [['voice', 'app'], ['app', 'api'], ['api', 'llm'], ['llm', 'tools'], ['api', 'memory'], ['llm', 'memory'], ['tick', 'memory'], ['tick', 'api']],
    },
    links: [{ label: 'Private repo · demo on request', href: null }],
  },
  {
    id: 'expense',
    name: 'Expense Tracker',
    tagline: 'Private, local-only personal finance built on real bank exports.',
    year: '2026',
    status: 'Working, used monthly',
    areas: ['data', 'software'],
    stack: ['Python', 'Streamlit', 'SQLite', 'pytest', 'YAML'],
    summary:
      'A finance tracker that never leaves my laptop. It reads the CSV exports from my real bank and credit card, cleans and de-duplicates them, and turns them into a monthly dashboard.',
    highlights: [
      'Detects which bank a file came from using YAML profiles',
      'De-duplicates overlapping statements with transaction fingerprints',
      'Pairs transfers between accounts and splits shared expenses',
      'Dashboard: spending by category, income vs spending, 6-month trend',
    ],
    decisions: [
      {
        title: 'Raw transactions are never edited',
        body: 'Imports land in an immutable raw table and every change is a layer on top, so I can always trace a number back to the bank file it came from.',
      },
      {
        title: 'A test that fails on any network call',
        body: '"Local-only" is a promise, so it is enforced by the test suite instead of by good intentions.',
      },
      {
        title: 'Versioned migrations from day one',
        body: 'The schema changed often while I built it. A small migration runner kept my real data safe through every change.',
      },
    ],
    diagram: {
      nodes: [
        { id: 'csv', label: 'Bank CSVs', x: 8, y: 50, detail: 'Raw exports from Scotiabank chequing and a Rogers Mastercard.' },
        { id: 'detect', label: 'Detect', x: 26, y: 22, detail: 'Matches the file against YAML bank profiles to know how to read it.' },
        { id: 'normalize', label: 'Normalize', x: 44, y: 50, detail: 'One schema for dates, amounts and merchants, whatever the bank.' },
        { id: 'dedupe', label: 'De-dupe', x: 62, y: 22, detail: 'Fingerprints each transaction so overlapping statements never double count.' },
        { id: 'db', label: 'SQLite', x: 62, y: 78, detail: 'Immutable raw table plus versioned migrations. Lives outside the repo.' },
        { id: 'review', label: 'Review', x: 80, y: 50, detail: 'Categories, splits, money owed to me and transfer pairing.' },
        { id: 'dash', label: 'Dashboard', x: 94, y: 22, detail: 'Monthly spending, net savings, top merchants, coverage warnings.' },
      ],
      edges: [['csv', 'detect'], ['detect', 'normalize'], ['normalize', 'dedupe'], ['dedupe', 'db'], ['db', 'review'], ['review', 'dash']],
    },
    links: [{ label: 'Code on GitHub', href: 'https://github.com/AyushhPatell/Expense-Tracker' }],
  },
  {
    id: 'dayblock',
    name: 'Dayblock',
    tagline: 'A daily sliding-block puzzle for iPhone. Try one below.',
    year: '2026',
    status: 'Preparing for the App Store',
    areas: ['software'],
    stack: ['Swift', 'SwiftUI', 'Swift Package', 'XCTest'],
    summary:
      'One new puzzle a day, the same for everyone, easy on Monday and expert on Sunday. Each swipe slides every block until something stops it. Get each coloured block onto its matching square in as few swipes as possible.',
    highlights: [
      'Daily puzzle with streaks and a spoiler-free share text',
      'Endless practice at four difficulties',
      'Par is the fewest possible swipes, found by a solver',
    ],
    decisions: [
      {
        title: 'Puzzle logic lives in its own Swift package',
        body: 'The rules, the solver and a command-line tool are separate from the app, so every puzzle can be generated and checked by tests before anyone plays it.',
      },
      {
        title: 'Undo never refunds a swipe',
        body: 'It keeps the score honest and makes the daily puzzle fair to compare with friends.',
      },
    ],
    links: [
      { label: 'Code on GitHub', href: 'https://github.com/AyushhPatell/Dayblock' },
      { label: 'Coming to the App Store', href: null },
    ],
    demo: 'tilt',
  },
  {
    id: 'codebrief',
    name: 'codebrief',
    tagline: 'Point it at any codebase and get a plain-English explanation.',
    year: '2026',
    status: 'Working CLI',
    areas: ['ai', 'software'],
    stack: ['Python', 'OpenAI API', 'Git', 'CLI'],
    summary:
      'A command-line tool for the moment you open an unfamiliar project. Give it a local folder or a public GitHub URL. It reads the structure and the important files, then writes a clear summary of what the project is and how the pieces fit together.',
    highlights: [
      'Works on a local folder or a public GitHub repo',
      'Shallow-clones repos into a temporary folder and cleans up after',
      'Picks the files that matter instead of sending everything to the model',
      'API key is only read from a local .env, never committed',
    ],
    decisions: [
      {
        title: 'Choose the context, don’t dump it',
        body: 'Sending a whole repository to a model is slow and expensive. codebrief gathers the folder structure and key files first, so the model sees what a person would read first.',
      },
    ],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/AyushhPatell/codebrief' }],
  },
  {
    id: 'myhub',
    name: 'MyHub',
    tagline: 'An academic dashboard with an AI assistant built in.',
    year: '2025',
    status: 'Live',
    areas: ['software', 'ai'],
    stack: ['React', 'TypeScript', 'Firebase', 'OpenAI API', 'Tailwind'],
    summary:
      'Courses, assignments and schedules in one place, synced in real time. An assistant reads your workload and suggests what to do next.',
    highlights: [
      'Real-time sync with Firebase Auth and Firestore',
      'AI assistant that turns your data into reminders and shortcuts',
      'Search, recurring templates, keyboard shortcuts, light and dark mode',
    ],
    decisions: [],
    links: [
      { label: 'Open the live app', href: 'https://myhub-d0f5a.web.app' },
      { label: 'Code on GitHub', href: 'https://github.com/AyushhPatell/MyHub' },
    ],
  },
  {
    id: 'kachuful',
    name: 'Kachuful',
    tagline: 'An online multiplayer version of the card game Kachuful.',
    year: '2026',
    status: 'Playable, still growing',
    areas: ['software'],
    stack: ['React', 'Vite', 'Firebase', 'Firestore', 'Tailwind', 'GitHub Actions'],
    summary:
      'Friends join a table with a 6-digit code, no install needed. The game handles dealing, calling, tricks, scoring and the rotating trump suit, live for every player at once.',
    highlights: [
      'Real-time lobby and game state with Firestore listeners',
      'Join requests the host approves, so strangers can’t walk in',
      'Game rules covered by logic tests that run before every deploy',
      'Works on phones, tablets and laptops, and can be added to the home screen',
    ],
    decisions: [
      {
        title: 'Game rules live in plain functions',
        body: 'Scoring, dealing and trick evaluation are pure JavaScript with no Firebase inside, so they can be tested on their own and trusted by every screen.',
      },
      {
        title: 'Deploys only if the rules still pass',
        body: 'A GitHub Actions pipeline runs the logic tests, builds and deploys on every push. A broken rule never reaches the players.',
      },
    ],
    links: [
      { label: 'Play it live', href: 'https://kachuful-70077.web.app' },
      { label: 'Code on GitHub', href: 'https://github.com/AyushhPatell/Kachuful' },
    ],
  },
];

export interface Job {
  org: string;
  role: string;
  when: string;
  where: string;
  kind: string;
  points: string[];
  tags: string[];
}

export const jobs: Job[] = [
  {
    org: 'Halifax Regional Municipality',
    role: 'Student Analytics Developer',
    when: 'May – Dec 2026',
    where: 'Halifax, NS',
    kind: 'Co-op',
    points: [
      'Build Power BI dashboards and reports on data pulled from SAP and other municipal systems.',
      'Built a Power Apps application and a SharePoint solution for internal teams.',
      'Work with staff to turn reporting requests into data models they can rely on.',
    ],
    tags: ['Power BI', 'DAX', 'SAP', 'Power Apps', 'SharePoint', 'SQL'],
  },
  {
    org: 'MacGregors Industrial Group',
    role: 'Application Developer',
    when: 'May – Aug 2025',
    where: 'New Glasgow, NS',
    kind: 'Co-op',
    points: [
      'Built a reporting system across Access, SharePoint and Crystal Reports to standardize performance tracking for three divisions.',
      'Automated workflows with Power Automate and VBA, and added features to internal web apps.',
    ],
    tags: ['MS Access', 'SharePoint', 'Power BI', 'Power Automate', 'VBA', 'JavaScript'],
  },
  {
    org: 'Canada Revenue Agency',
    role: 'IT Analyst',
    when: 'Sep – Dec 2024',
    where: 'Summerside, PEI',
    kind: 'Co-op',
    points: [
      'Wrote PowerShell and Java scripts to automate file processing and data validation.',
      'First point of contact for staff across departments, solving software and hardware issues.',
    ],
    tags: ['PowerShell', 'Java', 'Windows', 'Troubleshooting'],
  },
  {
    org: 'Dalhousie University',
    role: 'Support Desk Technician · Captioning Support',
    when: 'Sep 2025 – now',
    where: 'Halifax, NS',
    kind: 'Part-time',
    points: [
      'IT support for students and staff by phone, email, tickets and in person.',
      'Caption lecture recordings in Panopto so courses meet accessibility standards.',
    ],
    tags: ['IT support', 'Accessibility'],
  },
];

export const now = {
  updated: 'November 2026',
  items: [
    'Finishing my co-op at Halifax Regional Municipality.',
    'Daily hands-on practice in Python, SQL and Java.',
    'Writing a small AI agent from scratch to understand tool calling end to end.',
    'Learning modern data tooling: dbt, DuckDB and scheduled pipelines.',
  ],
};

export const howIBuild = [
  {
    title: 'Design first',
    body: 'I start with the problem, the data and the failure cases. ORBIT has a written set of rules and a decision log that every feature is checked against.',
  },
  {
    title: 'Private by default',
    body: 'My expense tracker never touches the internet, and ORBIT can run its model on my own Mac. If the data is personal, it stays with the person.',
  },
  {
    title: 'Measure before changing',
    body: 'ORBIT logs what it would do for weeks before it is allowed to do it. I change things after I see the evidence, not before.',
  },
];

/** A verified level: par 5 (up, right, down, right, down). */
export const demoLevel: Level = {
  size: 5,
  walls: ['3,2,left', '0,2,right', '4,2,left', '2,1,up'],
  blocks: [
    { id: 'a', color: 'a' },
    { id: 'b', color: 'b' },
    { id: 'g', color: null },
  ],
  start: [
    [3, 0],
    [2, 0],
    [4, 2],
  ],
  targets: { a: [4, 4], b: [3, 4] },
};
