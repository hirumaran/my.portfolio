'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Point = { x: number; y: number };
type Direction = Point;
type GameStatus = 'playing' | 'paused' | 'game-over';

type GameState = {
  snake: Point[];
  food: Point;
  score: number;
  highScore: number;
  status: GameStatus;
};

const COLS = 24;
const ROWS = 14;
const HIGH_SCORE_KEY = 'td-terminal-snake:v1';

const DIRECTIONS: Record<string, Direction> = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
};

const START_DIRECTION = DIRECTIONS.ArrowRight;

function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function createGame(highScore = 0): GameState {
  return {
    snake: [
      { x: 7, y: 7 },
      { x: 6, y: 7 },
      { x: 5, y: 7 },
      { x: 4, y: 7 },
    ],
    food: { x: 17, y: 7 },
    score: 0,
    highScore,
    status: 'playing',
  };
}

function placeFood(snake: Point[]): Point {
  const occupied = new Set(snake.map(({ x, y }) => `${x}:${y}`));
  const open: Point[] = [];

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!occupied.has(`${x}:${y}`)) open.push({ x, y });
    }
  }

  return open[Math.floor(Math.random() * open.length)] ?? { x: 17, y: 7 };
}

function readHighScore(): number {
  try {
    const stored = Number(window.localStorage.getItem(HIGH_SCORE_KEY));
    return Number.isFinite(stored) && stored > 0 ? Math.floor(stored) : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // The game still works when storage is blocked or unavailable.
  }
}

export default function TerminalSnake({ onExit }: { onExit: () => void }) {
  const [game, setGame] = useState<GameState>(() =>
    createGame(readHighScore()),
  );
  const gameRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<Direction>(START_DIRECTION);
  const queuedDirectionRef = useRef<Direction>(START_DIRECTION);

  const reset = useCallback(() => {
    directionRef.current = START_DIRECTION;
    queuedDirectionRef.current = START_DIRECTION;
    setGame((current) => createGame(current.highScore));
    gameRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    gameRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (game.highScore > 0) saveHighScore(game.highScore);
  }, [game.highScore]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === 'Escape' || key === 'q') {
        event.preventDefault();
        onExit();
        return;
      }

      if (key === 'r') {
        event.preventDefault();
        reset();
        return;
      }

      if (key === ' ') {
        event.preventDefault();
        setGame((current) => ({
          ...current,
          status: current.status === 'game-over'
            ? current.status
            : current.status === 'paused'
              ? 'playing'
              : 'paused',
        }));
        return;
      }

      const next = DIRECTIONS[key];
      if (!next) return;

      event.preventDefault();
      const queued = queuedDirectionRef.current;
      const reverses = next.x + queued.x === 0 && next.y + queued.y === 0;
      if (!reverses) queuedDirectionRef.current = next;
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onExit, reset]);

  const speed = Math.max(62, 118 - game.score * 4);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGame((current) => {
        if (current.status !== 'playing') return current;

        const direction = queuedDirectionRef.current;
        directionRef.current = direction;
        const head = current.snake[0];
        const nextHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };
        const ate = samePoint(nextHead, current.food);
        const collisionBody = ate
          ? current.snake
          : current.snake.slice(0, -1);
        const hitWall =
          nextHead.x < 0 ||
          nextHead.x >= COLS ||
          nextHead.y < 0 ||
          nextHead.y >= ROWS;
        const hitSelf = collisionBody.some((segment) =>
          samePoint(segment, nextHead),
        );

        if (hitWall || hitSelf) {
          return { ...current, status: 'game-over' };
        }

        const snake = [nextHead, ...current.snake];
        if (!ate) snake.pop();

        const score = current.score + (ate ? 1 : 0);
        return {
          snake,
          food: ate ? placeFood(snake) : current.food,
          score,
          highScore: Math.max(current.highScore, score),
          status: current.status,
        };
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [speed]);

  const board = useMemo(() => {
    const snakeByCell = new Map(
      game.snake.map((point, index) => [`${point.x}:${point.y}`, index]),
    );
    const horizontal = '─'.repeat(COLS);
    const rows = [`┌${horizontal}┐`];

    for (let y = 0; y < ROWS; y += 1) {
      let row = '│';
      for (let x = 0; x < COLS; x += 1) {
        const snakeIndex = snakeByCell.get(`${x}:${y}`);
        if (snakeIndex === 0) row += '●';
        else if (snakeIndex !== undefined) row += '■';
        else if (samePoint({ x, y }, game.food)) row += '◆';
        else row += ' ';
      }
      rows.push(`${row}│`);
    }

    rows.push(`└${horizontal}┘`);
    return rows.join('\n');
  }, [game.food, game.snake]);

  const statusCopy =
    game.status === 'game-over'
      ? 'GAME OVER — R TO RESTART'
      : game.status === 'paused'
        ? 'PAUSED — SPACE TO RESUME'
        : 'ARROWS / WASD TO MOVE';

  return (
    <div
      ref={gameRef}
      tabIndex={0}
      className="mt-3 flex min-h-0 flex-1 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-[var(--terminal-accent)]"
      aria-label="ASCII Snake game. Use arrow keys or W A S D to move, Space to pause, R to restart, and Escape to exit."
    >
      <div className="flex items-center justify-between border-y border-[var(--terminal-border)] py-2 uppercase tracking-[0.12em]">
        <span>Snake.exe</span>
        <span className="tabular-nums">
          Score {String(game.score).padStart(2, '0')} · Hi{' '}
          {String(game.highScore).padStart(2, '0')}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-2">
        <pre
          aria-hidden="true"
          className="select-none text-[11px] leading-[1.18] text-[var(--terminal-fg)] sm:text-[12px]"
        >
          {board}
        </pre>
        <p
          className={`mt-2 min-h-6 text-center uppercase tracking-[0.1em] ${
            game.status === 'game-over'
              ? 'text-[var(--ansi-red)]'
              : 'text-[var(--terminal-accent)]'
          }`}
          aria-live="polite"
        >
          {statusCopy}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-px bg-[var(--terminal-border)]">
        <button
          type="button"
          onClick={() =>
            setGame((current) => ({
              ...current,
              status: current.status === 'game-over'
                ? current.status
                : current.status === 'paused'
                  ? 'playing'
                  : 'paused',
            }))
          }
          disabled={game.status === 'game-over'}
          className="min-h-11 bg-[var(--terminal-bg)] px-2 uppercase disabled:opacity-35"
        >
          {game.status === 'paused' ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="min-h-11 bg-[var(--terminal-bg)] px-2 uppercase"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={onExit}
          className="min-h-11 bg-[var(--terminal-bg)] px-2 uppercase"
        >
          Esc / Exit
        </button>
      </div>
    </div>
  );
}
