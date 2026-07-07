'use client';

import { useEffect, useRef, useState } from 'react';
import ThemePanel from '@/components/site/ThemePanel';
import {
  TERMINAL_THEMES,
  isTerminalTheme,
  useTerminalTheme,
  type TerminalTheme,
} from '@/components/site/ThemeProvider';
import {
  activities,
  education,
  experience,
  profile,
  skills,
  terminal,
} from '@/data/resume';

/**
 * Interactive terminal for the hero's themed cell. Type or click commands;
 * ↑/↓ walks history, Tab completes. Every color flows from the --terminal-*
 * theme tokens (ThemeProvider + globals.css); the native caret and a brief
 * boot flicker on theme change are the only motion.
 */

type Line = {
  id: number;
  kind: 'cmd' | 'out';
  node: React.ReactNode;
};

const DOCUMENTED = [
  'whoami',
  'currently',
  'interests',
  'work',
  'stack',
  'edu',
  'contact',
  'dither',
  'undither',
  'width',
  'theme',
  'clear',
] as const;

const COMPLETIONS = [
  ...DOCUMENTED,
  'help',
  'ls',
  'pwd',
  'cd ',
  'echo ',
  'history',
  'neofetch',
  'date',
  'dither ',
  'theme ',
  'themes',
];

/* The prompt glyph follows the theme — part of each theme's personality. */
const PROMPTS: Record<TerminalTheme, string> = {
  light: '>',
  dark: '>',
  blueprint: '»',
  terminal: '$',
};

/* Palette for `dither <color>` — dot color on the paper ground. */
const DITHER_COLORS: Record<string, string> = {
  ink: '#292929',
  green: '#16a34a',
  amber: '#d97706',
  red: '#dc2626',
  blue: '#2563eb',
  violet: '#7c3aed',
};

const HEX_RE = /^#?([0-9a-f]{6})$/i;

const SECTIONS: Record<string, string> = {
  work: '01 — selected work',
  toolbox: '02 — toolbox',
  about: '03 — about',
  contact: '04 — contact',
};

type TerminalProps = {
  /** Current state of the hero photo's dither treatment. */
  ditherOn: boolean;
  onDither: (next: { on: boolean; color?: string }) => void;
  /** Terminal column width (desktop) — adjustable via `width` or the drag edge. */
  termWidth: number;
  onTermWidth: (px: number) => void;
};

export default function Terminal({
  ditherOn,
  onDither,
  termWidth,
  onTermWidth,
}: TerminalProps) {
  const { theme, setTheme } = useTerminalTheme();
  const prompt = PROMPTS[theme];
  const [panelOpen, setPanelOpen] = useState(false);

  // Stored line nodes dispatch clicks through this ref so they always hit
  // the latest run() — never a stale closure over vimMode/history.
  const runRef = useRef<(cmd: string) => void>(() => {});

  // Inline-block + padding cancelled by negative margins: ≥44px hit target
  // without shifting the text layout. `relative` keeps the extended hit area
  // above neighboring lines. The log's 25px line pitch (12.5px × leading-[2])
  // exceeds the 24px total vertical extension, so targets on adjacent lines
  // never overlap.
  const cmdButton = (cmd: string) => (
    <button
      type="button"
      onClick={() => runRef.current(cmd)}
      className="relative -mx-1 -my-3 inline-block cursor-pointer px-1 py-3 underline underline-offset-4 hover:no-underline focus-visible:outline-paper"
    >
      {cmd}
    </button>
  );

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const [vimMode, setVimMode] = useState(false);
  // Boot transcript built in the lazy initializer: it is part of the server
  // HTML and the initial accessibility tree, so the aria-live region does not
  // announce it as new content on load.
  const [lines, setLines] = useState<Line[]>(() => {
    const boot: Line[] = [];
    let id = 0;
    const add = (kind: Line['kind'], node: React.ReactNode) =>
      boot.push({ id: ++id, kind, node });
    (['whoami', 'currently', 'interests'] as const).forEach((c) => {
      add('cmd', c);
      terminal[c].forEach((t) => add('out', t));
    });
    add('out', ' ');
    add(
      'out',
      <>type {cmdButton('help')} for commands — or click any of these.</>,
    );
    add(
      'out',
      <>
        the photo is dithered — {cmdButton('dither green')} recolors it,{' '}
        {cmdButton('undither')} reveals the real one.
      </>,
    );
    add(
      'out',
      <>
        i also have themes: {cmdButton('theme blueprint')} switches, and{' '}
        {cmdButton('themes')} opens the picker.
      </>,
    );
    return boot;
  });
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ids continue from whatever is on screen — no ref reads during render.
  const push = (kind: Line['kind'], node: React.ReactNode) =>
    setLines((prev) => [
      ...prev,
      { id: (prev[prev.length - 1]?.id ?? 0) + 1, kind, node },
    ]);

  const helpLine = (
    <>
      {DOCUMENTED.map((c, i) => (
        <span key={c}>
          {i > 0 ? '  ' : ''}
          {cmdButton(c)}
        </span>
      ))}
    </>
  );

  function respond(raw: string): React.ReactNode[] | 'CLEAR' {
    const full = raw.trim();
    const lower = full.toLowerCase();
    const [head, ...rest] = lower.split(/\s+/);
    const arg = rest.join(' ');

    if (vimMode) {
      if ([':q', ':q!', ':wq', ':x', 'q', 'exit'].includes(lower)) {
        setVimMode(false);
        return ['you’re free. that was close.'];
      }
      return ['-- INSERT --  (this is vim. type :q! to escape)'];
    }

    switch (head) {
      case '':
        return [];
      case 'help':
        return [
          helpLine,
          ' ',
          'undocumented commands exist. poke around.',
        ];
      case 'whoami':
        return [...terminal.whoami];
      case 'currently':
        return [...terminal.currently];
      case 'interests':
        return [...terminal.interests];
      case 'work':
        return [
          ...experience.map((e) => `${e.period} — ${e.company}`),
          ' ',
          <>full detail: {cmdButton('cd work')}</>,
        ];
      case 'stack':
        return [
          skills.languages.join(', '),
          skills.frameworks.join(', '),
          skills.aiMedia.join(', '),
        ];
      case 'edu':
        return [
          ...education.map((e) => `${e.school} — ${e.credential}`),
          `${terminal.whoami[2]}.`,
        ];
      case 'contact':
        return [
          <>
            <a
              className="relative -mx-1 -my-3 inline-block px-1 py-3 underline underline-offset-4 hover:no-underline focus-visible:outline-paper"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          </>,
          <>
            <a
              className="relative -mx-1 -my-3 inline-block px-1 py-3 underline underline-offset-4 hover:no-underline focus-visible:outline-paper"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </>,
          profile.phone,
        ];
      case 'clear':
        return 'CLEAR';
      case 'theme': {
        if (!arg) {
          return [
            'Available themes:',
            ...TERMINAL_THEMES.map((t) => (
              <span key={t}>
                {'- '}
                {cmdButton(`theme ${t}`)}
                {t === theme ? '  (active)' : ''}
              </span>
            )),
            <>or {cmdButton('themes')} for the picker.</>,
          ];
        }
        if (isTerminalTheme(arg)) {
          if (arg === theme) return [`theme: already ${arg}.`];
          setTheme(arg);
          return [`theme → ${arg}. reinitializing… done.`];
        }
        return [
          `theme: unknown theme '${arg}' — try ${TERMINAL_THEMES.join(', ')}.`,
        ];
      }
      case 'themes':
        setPanelOpen((open) => !open);
        return [panelOpen ? 'theme picker closed.' : 'theme picker opened — hover previews, click commits.'];
      case 'dither': {
        if (!arg || arg === 'help') {
          return [
            <>
              dither is {ditherOn ? 'on' : 'off'}. it controls the photo up
              top: {cmdButton('dither green')} {cmdButton('dither amber')}{' '}
              {cmdButton('dither blue')} {cmdButton('dither ink')} — or any hex
              like dither #ff6600.
            </>,
            <>{cmdButton('dither off')} restores the original (hovering it does too).</>,
          ];
        }
        if (arg === 'off') {
          onDither({ on: false });
          return ['dither off — that’s the real me.'];
        }
        if (arg === 'on') {
          onDither({ on: true });
          return ['dither on.'];
        }
        if (DITHER_COLORS[arg]) {
          onDither({ on: true, color: DITHER_COLORS[arg] });
          return [`dither: ${arg}.`];
        }
        const hex = arg.match(HEX_RE);
        if (hex) {
          onDither({ on: true, color: `#${hex[1].toLowerCase()}` });
          return [`dither: #${hex[1].toLowerCase()}.`];
        }
        return [
          `dither: unknown color '${arg}' — try ${Object.keys(DITHER_COLORS).join(', ')}, or a #hex.`,
        ];
      }
      case 'undither':
        onDither({ on: false });
        return ['dither off — that’s the real me. (dither on brings it back)'];
      case 'width': {
        if (!arg) {
          return [
            `terminal width: ${termWidth}px — try width 500 (300–720), or drag my left edge.`,
          ];
        }
        // Number() (not parseInt) so '1e3' resolves to 1000 and trailing
        // garbage like '500abc' is rejected instead of silently truncated.
        const px = Math.round(Number(arg));
        if (!Number.isFinite(px)) {
          return [`width: '${arg}' is not a number — try width 500.`];
        }
        const clamped = Math.min(720, Math.max(300, px));
        onTermWidth(clamped);
        const isNarrow = !window.matchMedia('(min-width: 1024px)').matches;
        return [
          `terminal width: ${clamped}px${clamped !== px ? ` (clamped from ${px})` : ''}`,
          ...(isNarrow
            ? ['(applies on desktop — here i’m already full-width.)']
            : []),
        ];
      }
      case 'ls':
        if (arg.startsWith('outtakes')) {
          return ['two photos. about section, bottom left. worth it.'];
        }
        return ['work/  toolbox/  about/  contact/  outtakes/'];
      case 'pwd':
        return ['/users/deepak/portfolio'];
      case 'cd': {
        if (!arg || arg === '..' || arg === '~' || arg === '/') {
          window.scrollTo({ top: 0 });
          return ['→ top'];
        }
        const target = arg.replace(/\/$/, '');
        if (SECTIONS[target]) {
          document.getElementById(target)?.scrollIntoView();
          return [`→ ${SECTIONS[target]}`];
        }
        return [`cd: no such section: ${target}`];
      }
      case 'cat':
        if (arg.startsWith('outtakes')) {
          return ['two photos. about section, bottom left. worth it.'];
        }
        if (arg.includes('resume')) {
          return [
            `${profile.role}. ${experience.map((e) => e.company).join(' → ')}.`,
            <>the long version is this whole page. {cmdButton('cd work')}</>,
          ];
        }
        return [`cat: ${arg || 'missing operand'}: nothing here`];
      case 'echo':
        return [full.slice(5) || ' '];
      case 'date':
        return [new Date().toString()];
      case 'history':
        return history.length ? [...history] : ['(empty)'];
      case 'sudo':
        return ['deepak is not in the sudoers file. this incident will be reported.'];
      case 'rm':
        return ['no. the grid stays.'];
      case 'vim':
      case 'vi':
      case 'nano':
      case 'emacs':
        setVimMode(true);
        return ['you’re in vim now. good luck. (:q! to escape)'];
      case 'exit':
      case 'quit':
      case 'logout':
        return ['there’s no exit. the contact button works, though.'];
      case 'hello':
      case 'hi':
      case 'hey':
        return [<>hey. type {cmdButton('help')} if you’re lost.</>];
      case 'aristotle':
      case 'quote':
        return [
          '“men become builders by building.” — aristotle',
          '(it used to be a whole marquee. it’s better down here.)',
        ];
      case 'ramen':
        return [
          `${activities[0].name.toLowerCase()}, ${activities[0].role.toLowerCase()}. also a solid dinner.`,
        ];
      case 'coffee':
        return ['brewing… done. back to work.'];
      case 'talos':
        return [
          experience[0].headline.toLowerCase(),
          <>details: {cmdButton('cd work')}</>,
        ];
      case 'northeastern':
        return [
          `${terminal.whoami[2].replace(' Northeastern', '').toLowerCase()}. go huskies.`,
        ];
      case 'sl':
        return ['you meant ls. (the train doesn’t fit in this cell.)'];
      case 'man':
        return ['you’re looking at it.'];
      case 'whoareyou':
        return ['a terminal. on a portfolio. living the dream.'];
      case 'neofetch':
        return [
          `▀█▀ █▀▄   deepak @ ${profile.location.toLowerCase()}`,
          ' █  █▄▀   os: mono v2.0',
          '          shell: deepak-sh',
          ' ',
          `status: ${terminal.currently[0].toLowerCase()} · ${profile.availability.toLowerCase()}`,
          ...activities.slice(0, 1).map((a) => `also: ${a.name.toLowerCase()}`),
        ];
      default:
        return [
          <>
            command not found: {head} — try {cmdButton('help')}
          </>,
        ];
    }
  }

  function run(raw: string) {
    const cmd = raw.trim();
    push('cmd', cmd);
    if (cmd) {
      setHistory((prev) => [...prev, cmd]);
    }
    setHistPos(-1);
    const result = respond(cmd);
    if (result === 'CLEAR') {
      setLines([]);
    } else {
      result.forEach((node) => push('out', node));
    }
    setInput('');
    // Return focus to the prompt: a clicked button may have unmounted itself
    // (`clear`), which would otherwise drop focus to <body>. preventScroll
    // keeps `cd <section>` navigation from being scrolled back.
    inputRef.current?.focus({ preventScroll: true });
  }

  // Keep the click-dispatch ref pointing at the freshest run().
  useEffect(() => {
    runRef.current = run;
  });

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // One subtle flicker when a theme boots (skipped on first mount; the CSS
  // animation is disabled entirely under prefers-reduced-motion).
  const [booting, setBooting] = useState(false);
  const firstThemeRef = useRef(true);
  useEffect(() => {
    if (firstThemeRef.current) {
      firstThemeRef.current = false;
      return;
    }
    setBooting(true);
    const timer = window.setTimeout(() => setBooting(false), 260);
    return () => window.clearTimeout(timer);
  }, [theme]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Never act on keys that are part of an IME composition (e.g. the Enter
    // that commits a CJK candidate).
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      run(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const pos = histPos === -1 ? history.length - 1 : Math.max(0, histPos - 1);
      setHistPos(pos);
      setInput(history[pos]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histPos === -1) return;
      const pos = histPos + 1;
      if (pos >= history.length) {
        setHistPos(-1);
        setInput('');
      } else {
        setHistPos(pos);
        setInput(history[pos]);
      }
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Only swallow Tab when a completion is actually applied — otherwise
      // Tab/Shift+Tab follow the normal focus order (no keyboard trap).
      const cur = input.toLowerCase();
      if (!cur) return;
      const hit = COMPLETIONS.find((c) => c.startsWith(cur) && c !== cur);
      if (hit) {
        e.preventDefault();
        setInput(hit);
      }
    }
  }

  return (
    <div
      className={`flex h-full min-h-0 flex-col p-5 font-term text-[12.5px] leading-[2] ${
        booting ? 'term-boot' : ''
      }`}
      onClick={(e) => {
        if (window.getSelection()?.toString()) return;
        if ((e.target as HTMLElement).closest('a, button')) return;
        // Fine pointers only: on touch, a stray tap on the output should not
        // pop the software keyboard.
        if (!window.matchMedia('(pointer: fine)').matches) return;
        inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="label">Terminal</span>
        <button
          type="button"
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          className="label-wide relative -my-3 inline-block cursor-pointer py-3 underline-offset-4 hover:underline"
        >
          Themes {panelOpen ? '▴' : '▾'}
        </button>
      </div>

      {panelOpen ? (
        <ThemePanel onSelect={(t) => runRef.current(`theme ${t}`)} />
      ) : null}

      <div
        ref={outRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        // Focusable so keyboard users can scroll the log (Chrome/Safari skip
        // scrollers that contain focusable children).
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.kind === 'cmd' ? (
              <span>
                <span aria-hidden="true">{prompt} </span>
                {line.node}
              </span>
            ) : (
              line.node
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span aria-hidden="true">{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command input"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          // 16px below md so iOS Safari doesn't auto-zoom on focus. Text and
          // caret colors ride the theme tokens.
          className="min-w-0 flex-1 bg-transparent font-term text-[16px] md:text-[12.5px]"
          style={{ caretColor: 'var(--terminal-cursor)' }}
        />
      </div>
    </div>
  );
}
