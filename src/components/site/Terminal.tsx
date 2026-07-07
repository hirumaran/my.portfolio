'use client';

import { useEffect, useRef, useState } from 'react';
import {
  activities,
  education,
  experience,
  profile,
  skills,
  terminal,
} from '@/data/resume';

/**
 * Interactive terminal for the hero's ink cell. Type or click commands;
 * ↑/↓ walks history, Tab completes. All output stays ink/paper — the only
 * motion is the native input caret.
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
];

const SECTIONS: Record<string, string> = {
  work: '01 — selected work',
  toolbox: '02 — toolbox',
  about: '03 — about',
  contact: '04 — contact',
};

export default function Terminal() {
  const idRef = useRef(0);
  const nextId = () => ++idRef.current;

  // Stored line nodes dispatch clicks through this ref so they always hit
  // the latest run() — never a stale closure over vimMode/history.
  const runRef = useRef<(cmd: string) => void>(() => {});

  // Inline-block + padding cancelled by negative margins: ≥44px hit target
  // without shifting the text layout. `relative` keeps the extended hit area
  // above neighboring lines.
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
    const add = (kind: Line['kind'], node: React.ReactNode) =>
      boot.push({ id: nextId(), kind, node });
    (['whoami', 'currently', 'interests'] as const).forEach((c) => {
      add('cmd', c);
      terminal[c].forEach((t) => add('out', t));
    });
    add('out', ' ');
    add(
      'out',
      <>type {cmdButton('help')} for commands — or click any of these.</>,
    );
    return boot;
  });
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (kind: Line['kind'], node: React.ReactNode) =>
    setLines((prev) => [...prev, { id: nextId(), kind, node }]);

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
          'Incoming Northeastern.',
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
        return ['ramen robotics — frc team 9036, lead developer. also a solid dinner.'];
      case 'coffee':
        return ['brewing… done. back to work.'];
      case 'talos':
        return [
          'raw footage in → captioned, social-ready clip out.',
          <>details: {cmdButton('cd work')}</>,
        ];
      case 'northeastern':
        return ['incoming. go huskies.'];
      case 'sl':
        return ['you meant ls. (the train doesn’t fit in this cell.)'];
      case 'man':
        return ['you’re looking at it.'];
      case 'whoareyou':
        return ['a terminal. on a portfolio. living the dream.'];
      case 'neofetch':
        return [
          '▀█▀ █▀▄   deepak @ bellevue, wa',
          ' █  █▄▀   os: mono v2.0',
          '          shell: deepak-sh',
          ' ',
          `status: ${terminal.currently[0].toLowerCase()} · open to internships`,
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
      className="flex h-full min-h-0 flex-col p-5 font-term text-[12.5px] leading-[1.7] text-paper"
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
        <span className="label-wide">Interactive</span>
      </div>

      <div
        ref={outRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        // Focusable so keyboard users can scroll the log (Chrome/Safari skip
        // scrollers that contain focusable children).
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-paper"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.kind === 'cmd' ? (
              <span>
                <span aria-hidden="true">&gt; </span>
                {line.node}
              </span>
            ) : (
              line.node
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span aria-hidden="true">&gt;</span>
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
          // 16px below md so iOS Safari doesn't auto-zoom on focus; the
          // paper-recolored global focus-visible outline stays visible on ink.
          className="min-w-0 flex-1 bg-transparent font-term text-[16px] text-paper focus-visible:outline-paper md:text-[12.5px]"
          style={{ caretColor: 'var(--paper)' }}
        />
      </div>
    </div>
  );
}
