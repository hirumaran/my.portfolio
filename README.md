# Thirumaran Deepak — Portfolio

A single-page portfolio built with [Next.js](https://nextjs.org) (App Router) and React, styled as a stark white-walled gallery grid. It's a personal site for Thirumaran Deepak — a software engineer — covering about, experience, skills, and impact, with a few interactive touches:

- **Interactive terminal** — a hero terminal with commands like `dither <color>` for recoloring the portrait, plus a `karaoke` mode
- **Music player** — a top-center MacBook-style notch with compact and expanded playback controls
- **Line sidebar + scroll effects** — GSAP/motion-driven UI elements like ScrollBlur and SplitText
- **All copy** lives in `src/data/resume.ts`, so content updates don't touch components

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For production:

```bash
npm run build
npm start
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start the dev server           |
| `npm run build`   | Build for production           |
| `npm run start`   | Serve the production build     |
| `npm run lint`    | Run ESLint                     |

## Structure

```
src/
├── app/          # App Router pages & global styles
├── components/   # UI primitives + site sections (Hero, About, Terminal, ...)
├── data/         # resume.ts — all site content
├── lib/          # shared utilities
├── services/     # data services
└── themes/       # terminal theme definitions
```

## Deploy

Deploys as a static/edge app via [Vercel](https://vercel.com) (see `CNAME` for the custom domain).
