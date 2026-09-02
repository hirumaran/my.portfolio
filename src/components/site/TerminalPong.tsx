'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type GameStatus = 'playing' | 'paused' | 'game-over';

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type PongState = {
  playerY: number;
  cpuY: number;
  ball: Ball;
  playerScore: number;
  cpuScore: number;
  rally: number;
  bestRally: number;
  status: GameStatus;
};

const COLS = 28;
const ROWS = 14;
const PLAYER_X = 1;
const CPU_X = COLS - 2;
const PADDLE_HEIGHT = 3;
const WINNING_SCORE = 7;
const BEST_RALLY_KEY = 'td-terminal-pong:v1';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function serve(direction: 1 | -1): Ball {
  return {
    x: (COLS - 1) / 2,
    y: (ROWS - 1) / 2,
    vx: 0.62 * direction,
    vy: (Math.random() > 0.5 ? 1 : -1) * (0.23 + Math.random() * 0.14),
  };
}

function readBestRally(): number {
  try {
    const stored = Number(window.localStorage.getItem(BEST_RALLY_KEY));
    return Number.isFinite(stored) && stored > 0 ? Math.floor(stored) : 0;
  } catch {
    return 0;
  }
}

function saveBestRally(score: number) {
  try {
    window.localStorage.setItem(BEST_RALLY_KEY, String(score));
  } catch {
    // Pong remains playable when storage is blocked or unavailable.
  }
}

function createGame(bestRally = 0): PongState {
  const paddleY = Math.floor((ROWS - PADDLE_HEIGHT) / 2);
  return {
    playerY: paddleY,
    cpuY: paddleY,
    ball: serve(Math.random() > 0.5 ? 1 : -1),
    playerScore: 0,
    cpuScore: 0,
    rally: 0,
    bestRally,
    status: 'playing',
  };
}

function movePlayer(
  setGame: React.Dispatch<React.SetStateAction<PongState>>,
  amount: number,
) {
  setGame((current) => ({
    ...current,
    playerY: clamp(current.playerY + amount, 0, ROWS - PADDLE_HEIGHT),
  }));
}

export default function TerminalPong({ onExit }: { onExit: () => void }) {
  const [game, setGame] = useState<PongState>(() => createGame(readBestRally()));
  const gameRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setGame((current) => createGame(current.bestRally));
    gameRef.current?.focus({ preventScroll: true });
  }, []);

  const togglePause = useCallback(() => {
    setGame((current) => ({
      ...current,
      status:
        current.status === 'game-over'
          ? current.status
          : current.status === 'paused'
            ? 'playing'
            : 'paused',
    }));
  }, []);

  useEffect(() => {
    gameRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (game.bestRally > 0) saveBestRally(game.bestRally);
  }, [game.bestRally]);

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
        togglePause();
        return;
      }

      if (key === 'ArrowUp' || key === 'w') {
        event.preventDefault();
        movePlayer(setGame, -1);
      } else if (key === 'ArrowDown' || key === 's') {
        event.preventDefault();
        movePlayer(setGame, 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onExit, reset, togglePause]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGame((current) => {
        if (current.status !== 'playing') return current;

        const cpuTarget = current.ball.y - (PADDLE_HEIGHT - 1) / 2;
        const cpuY = clamp(
          current.cpuY + clamp(cpuTarget - current.cpuY, -0.42, 0.42),
          0,
          ROWS - PADDLE_HEIGHT,
        );

        let { x, y, vx, vy } = current.ball;
        x += vx;
        y += vy;

        if (y <= 0 || y >= ROWS - 1) {
          y = clamp(y, 0, ROWS - 1);
          vy *= -1;
        }

        const playerHit =
          vx < 0 &&
          x <= PLAYER_X + 0.7 &&
          y >= current.playerY - 0.35 &&
          y <= current.playerY + PADDLE_HEIGHT - 0.65;
        const cpuHit =
          vx > 0 &&
          x >= CPU_X - 0.7 &&
          y >= cpuY - 0.35 &&
          y <= cpuY + PADDLE_HEIGHT - 0.65;

        let rally = current.rally;
        let bestRally = current.bestRally;

        if (playerHit || cpuHit) {
          const paddleY = playerHit ? current.playerY : cpuY;
          const offset =
            (y - (paddleY + (PADDLE_HEIGHT - 1) / 2)) /
            ((PADDLE_HEIGHT + 1) / 2);
          vx = clamp(Math.abs(vx) * 1.035, 0.62, 0.96) * (playerHit ? 1 : -1);
          vy = clamp(vy + offset * 0.18, -0.72, 0.72);
          x = playerHit ? PLAYER_X + 0.8 : CPU_X - 0.8;
          rally += 1;
          bestRally = Math.max(bestRally, rally);
        }

        let playerScore = current.playerScore;
        let cpuScore = current.cpuScore;
        let status: GameStatus = current.status;
        let ball = { x, y, vx, vy };

        if (x < -0.5 || x > COLS - 0.5) {
          const playerWonPoint = x > COLS - 0.5;
          playerScore += playerWonPoint ? 1 : 0;
          cpuScore += playerWonPoint ? 0 : 1;
          status =
            playerScore >= WINNING_SCORE || cpuScore >= WINNING_SCORE
              ? 'game-over'
              : 'playing';
          ball = serve(playerWonPoint ? -1 : 1);
          rally = 0;
        }

        return {
          ...current,
          cpuY,
          ball,
          playerScore,
          cpuScore,
          rally,
          bestRally,
          status,
        };
      });
    }, 50);

    return () => window.clearInterval(timer);
  }, []);

  const board = useMemo(() => {
    const ballX = clamp(Math.round(game.ball.x), 0, COLS - 1);
    const ballY = clamp(Math.round(game.ball.y), 0, ROWS - 1);
    const playerTop = Math.round(game.playerY);
    const cpuTop = Math.round(game.cpuY);
    const horizontal = '─'.repeat(COLS);
    const rows = [`┌${horizontal}┐`];

    for (let y = 0; y < ROWS; y += 1) {
      let row = '│';
      for (let x = 0; x < COLS; x += 1) {
        const player =
          x === PLAYER_X && y >= playerTop && y < playerTop + PADDLE_HEIGHT;
        const cpu = x === CPU_X && y >= cpuTop && y < cpuTop + PADDLE_HEIGHT;

        if (x === ballX && y === ballY) row += '●';
        else if (player || cpu) row += '█';
        else if (x === Math.floor(COLS / 2)) row += '┊';
        else row += ' ';
      }
      rows.push(`${row}│`);
    }

    rows.push(`└${horizontal}┘`);
    return rows.join('\n');
  }, [game.ball.x, game.ball.y, game.cpuY, game.playerY]);

  const playerWon = game.playerScore > game.cpuScore;
  const statusCopy =
    game.status === 'game-over'
      ? `${playerWon ? 'YOU WIN' : 'CPU WINS'} — R TO REMATCH`
      : game.status === 'paused'
        ? 'PAUSED — SPACE TO RESUME'
        : 'W / S OR ARROWS TO MOVE';

  return (
    <div
      ref={gameRef}
      tabIndex={0}
      className="mt-3 flex min-h-0 flex-1 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-[var(--terminal-accent)]"
      aria-label="ASCII Pong game. Use W and S or the arrow keys to move, Space to pause, R to restart, and Escape to exit."
    >
      <div className="flex items-center justify-between border-y border-[var(--terminal-border)] py-2 uppercase tracking-[0.12em]">
        <span>Pong.exe</span>
        <span className="tabular-nums">
          You {game.playerScore} · {game.cpuScore} CPU
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-2">
        <div className="mb-1 flex w-full justify-between text-[var(--terminal-fg-muted)]">
          <span>First to {WINNING_SCORE}</span>
          <span className="tabular-nums">Rally {game.rally} · Best {game.bestRally}</span>
        </div>
        <pre
          aria-hidden="true"
          className="select-none text-[10px] leading-[1.12] text-[var(--terminal-fg)] sm:text-[11px]"
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

      <div className="grid grid-cols-5 gap-px bg-[var(--terminal-border)]">
        <button
          type="button"
          onClick={() => movePlayer(setGame, -1)}
          className="min-h-11 bg-[var(--terminal-bg)] px-1 uppercase"
        >
          ↑ / W
        </button>
        <button
          type="button"
          onClick={() => movePlayer(setGame, 1)}
          className="min-h-11 bg-[var(--terminal-bg)] px-1 uppercase"
        >
          ↓ / S
        </button>
        <button
          type="button"
          onClick={togglePause}
          disabled={game.status === 'game-over'}
          className="min-h-11 bg-[var(--terminal-bg)] px-1 uppercase disabled:opacity-35"
        >
          {game.status === 'paused' ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="min-h-11 bg-[var(--terminal-bg)] px-1 uppercase"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={onExit}
          className="min-h-11 bg-[var(--terminal-bg)] px-1 uppercase"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
