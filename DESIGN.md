# MONO — Design Spec

Portfolio for Thirumaran Deepak. One page. **Light only.** Concept: white-walled gallery
grid, museum contact sheet. Stark white cells, hard 2px ink rules, whisper-weight type.
Copied from the mono.frm.fm (Mono X7) design system: no shadows, no gradients, no radius,
no accent color — typography and grid are the entire visual language.

## Non-negotiable rules (every file)

1. First line of every section component: `'use client';`
2. One default-exported React component per file. No other files may be created or edited.
3. All copy comes from `src/data/resume.ts` — import it, never hardcode resume facts.
4. No new npm dependencies. No edits to package.json, globals.css, layout.tsx.
5. Icons: `lucide-react` only, 14–16px, stroke inherits currentColor. Use sparingly — the
   system is typographic; most "icons" are text glyphs like `→` and `↳`.
6. Colors ONLY: `bg-paper`, `text-ink`, `bg-ink`, `text-paper`, `border-ink`, `text-carbon`.
   NEVER any gray (`text-gray-*`, `text-neutral-*`, opacity-faded ink like `text-ink/60` is
   allowed only for large display text, never for labels or body). TWO sanctioned color
   exceptions: (a) the nav's availability status (green `#16a34a` dot + `#15803d` label);
   (b) the hero photo's dither tint when the USER recolors it via the terminal's
   `dither <color>` command — never pre-set a non-ink tint.
7. FORBIDDEN utilities: `shadow-*`, `rounded-*` (radius is 0 globally — never add any),
   `bg-gradient-*`, any color other than ink/paper/carbon, font weights 600+ (`font-semibold`,
   `font-bold`). Weights allowed: 100 (`font-thin`), 300 (`font-light`), 400 (`font-normal`),
   500 (`font-medium`, condensed labels only).
8. Interactive elements: `cursor-pointer`, visible `:focus-visible` outline (global — don't
   remove it), min 44px touch targets, transitions 300ms with
   `cubic-bezier(0.455,0.03,0.515,0.955)` (the `.btn-outline` class already does this).
9. External links: `target="_blank" rel="noopener noreferrer"`.
10. TypeScript strict — after writing, run `npx tsc --noEmit` and fix every error mentioning
    your file (ignore errors in other files).
11. Escape apostrophes/quotes in JSX text (`&apos;` / curly quotes `’`).
12. Motion: minimal and functional. NO entrance animations, NO stagger reveals, NO parallax,
    NO React Bits components (SplitText, ScrollReveal, SpotlightCard, TiltedCard, CountUp,
    etc. are retired), NO GSAP/motion imports. Hover state changes are the only motion.
    NO marquees/tickers and NO quotes — the numbering and labels carry the editorial
    register on their own. Shaders: the ONE sanctioned use is the hero portrait's static
    `ImageDithering` (paper-shaders) — ink #292929 on paper #ffffff, 8x8 Bayer, no motion;
    never animated shaders, never color.

## Tokens & shared classes (already defined in globals.css)

| Class | Meaning |
|---|---|
| `bg-paper` / `text-ink` | white `#ffffff` / ink `#292929` |
| `bg-ink` / `text-paper` | inverse dark cell |
| `text-carbon` | `#000000` — input text and decorative fills only |
| `font-nh` (default `font-sans`) | Inter — NH substitute, body + headlines |
| `font-cond` | Roboto Condensed — S-Condensed substitute, ALWAYS uppercase |
| `font-term` | Geist Mono — the hero terminal ONLY; never for labels or body |
| `.label` | cond 12px w500 uppercase +0.1em — plaque/tag text |
| `.label-wide` | cond 12px w300 uppercase +0.2em — nav, footer, vertical markers |
| `.display` | NH w300 −0.02em lh1.34 — section headline voice (size it per use) |
| `.display-thin` | NH w100 −0.02em lh1.1 — hero-scale voice |
| `.rule-grid` | `display:grid; gap:2px; background:ink` — children get `bg-paper` automatically; this is HOW interior 2px rules are drawn (never stack borders) |
| `.cell-ink` | direct child of `.rule-grid` that renders inverse (ink bg, paper text) |
| `.cell-pad` | 25/20px mobile → 43px/45px desktop cell padding |
| `.cell-pad-sm` | 20px cell padding |
| `.btn-outline` | 2px ink border, transparent, hover inverts to ink/paper |
| `.btn-inverse` | ink fill, paper text, hover inverts |
| `.text-link` | cond 12px w300 uppercase +0.2em, hover underline offset-4 |
| `.hairline-b` | 1px carbon bottom border — inputs & sub-rows only |

Type-scale utilities (size+leading+tracking bundled): `text-caption` 12, `text-body-sm` 14,
`text-body` 16, `text-body-lg` 18, `text-subheading` 25, `text-heading-sm` 32,
`text-heading` 40, `text-display` 43.

## The border system (read twice)

- 2px solid ink is the ONLY structural separator. No shadows, no fills-as-separators.
- Page is edge-to-edge: NO max-width container, NO horizontal page padding at section level.
  Cells run from viewport edge to viewport edge; padding lives INSIDE cells (`.cell-pad`).
- Sections butt against each other sharing one rule: every `<section>` gets
  `border-b-2 border-ink` and NOTHING gets `border-t` (Nav supplies the very first bottom
  rule). Interior divisions use `.rule-grid` (2px gap technique) so rules never double up.
- 1px appears ONLY as `.hairline-b` under inputs and inside sub-rows (education list,
  skills rows).

## Typography rhythm

- Section label cell: `<span className="label">01 — Selected Work</span>`
- Section headline: `.display text-heading-sm md:text-display` (32→43px)
- Hero scale: `.display-thin` at `clamp(3rem, 10vw, 8.5rem)`
- Body: `text-body font-light` (16px, w300, −0.02em)
- Metadata / periods / tech tags: `.label` or `.label-wide`
- Body copy left-aligned always. Condensed face ALWAYS uppercase.

## Section anchors & numbering

`#work` = Experience (01) · `#toolbox` = Skills (02) · `#about` = About (03) · `#contact` = Contact (04)

## Sections (one file each in `src/components/site/`, imported by page.tsx in this order)

### Providers.tsx
Reduce to a pure pass-through: `'use client'`, default export returning `<>{children}</>`.
No ClickSpark, no wrappers. (File kept so page.tsx keeps its shape.)

### Nav.tsx
Sticky top (`sticky top-0 z-50`), `bg-paper`, `border-b-2 border-ink`. NOT transparent, NO
backdrop blur — a solid paper bar like mono's. Single row `h-14 flex items-stretch` with
2px vertical rules BETWEEN zones (use `.rule-grid` with `grid-cols-[auto_1fr_auto]` or flex
children with `border-l-2` on all but first — pick one, no doubles).
- Zone 1 (left): `<a href="#top">` wordmark `THIRUMARAN DEEPAK` in `.label-wide`, px-5,
  flex items-center.
- Zone 2 (center, `hidden md:flex`, justify-end): links `WORK` `TOOLBOX` `ABOUT` in
  `.text-link` px-5 flex items-center h-full.
- Zone 1b (after the wordmark, own 2px left rule): availability status — 8px square
  `bg-[#16a34a]` (zero radius) + `.label-wide` `OPEN TO WORK` in `#15803d`. The system's
  sanctioned color accent.
- Zone 3 (right): `<a href="#contact">` rendered as inverse zone — `bg-ink text-paper`
  `.label` px-5 flex items-center, hover `bg-paper text-ink` transition (a Dark Inverse
  Cell acting as the CTA). Text: `CONTACT`.
- On mobile only wordmark + status + CONTACT zone show.
No vertical sidebar label — the page edges stay clean.

### Hero.tsx
`<section id="top">` `border-b-2 border-ink`. `.rule-grid .hero-grid` (globals.css:
`1fr var(--term-w)` on md+, driven by React state), `min-h-[calc(100dvh-56px-2px)]` on
desktop (nav is h-14). Hero owns shared state: `dither {on, color}` and `termWidth`
(300–720, default 380), both controlled from the terminal.
Grid on md+: `1fr minmax(280px,380px) var(--term-w)` — text cell | portrait module |
terminal column.
- **Main cell** (`.cell-pad` flex flex-col justify-between gap-12):
  - Top row: `.label` line `SOFTWARE ENGINEER — PORTFOLIO` + `.label-wide` `EST. BELLEVUE, WA`.
  - Middle: `<h1>` `.display-thin text-[clamp(3rem,10vw,8.5rem)]` firstName/lastName
    stacked + tagline below.
  - Bottom row: `<a className="btn-inverse" href="#work">SELECTED WORK →</a>` and
    `<a className="btn-outline" href="#contact">GET IN TOUCH</a>`, gap-[2px] flex-wrap.
- **Portrait module** (own full-height cell between text and terminal,
  `min-h-[440px] md:min-h-0`): a stacked pair — original `next/image` (preload) under a
  static `ImageDithering` shader (paper ground, `dither.color` dots, 8x8 Bayer, size 2,
  colorSteps 2). Hover crossfades to the original (300ms system curve); the terminal's
  `dither`/`undither` commands recolor or remove it. Wrapper has `role="img"` +
  aria-label; the shader layer is pointer-events-none.
- **Terminal column** (the whole right side, `.cell-ink relative min-h-[440px]
  overflow-hidden`): the **interactive terminal** (`Terminal.tsx`) — the page's pony
  trick, undiluted. Boot pre-runs whoami/currently/interests from `terminal` in
  resume.ts, prints the help hint AND the dither hint (both with clickable commands),
  then a live prompt: typed or clicked commands, ↑/↓ history, Tab completion,
  `cd <section>` navigation, `dither <color>|off` / `undither` (photo control),
  `width <px>` (resizes the column), plus undocumented easter eggs. A `role="separator"`
  drag edge (keyboard: arrows/Home) on the cell's left border resizes the column on md+.
  font-term 12.5px paper-on-ink; native caret only; NOT aria-hidden. No CURRENTLY/STATUS
  cells — that info lives in the terminal and the nav status.
  On mobile the terminal renders below the main cell, full-width.

### Experience.tsx
`<section id="work">` `border-b-2 border-ink`.
- Header row: `.rule-grid grid-cols-[1fr_auto]`: left cell `.cell-pad-sm` `.label`
  `01 — SELECTED WORK`; right cell `.cell-pad-sm` `.label-wide` `2022 — 2026` (flex
  items-center).
- Below header (part of same outer rule-grid or a second rule-grid row — keep ONE
  `.rule-grid` wrapping header + all entries as rows): each `experience` entry is a row.
  - **Featured** entries: full-width row containing a nested `.rule-grid`
    `md:grid-cols-[280px_1fr]`:
    - Meta cell `.cell-pad-sm md:cell-pad` flex flex-col gap-2: index `0${i+1}` in
      `.display-thin text-heading`, then `.label` `{role}`, `.label-wide` `{period}`,
      and at bottom tech list as `.label-wide` joined with ` / `.
    - Content cell `.cell-pad`: company `.display text-heading-sm md:text-display`,
      headline `text-body-lg font-light mt-3 max-w-3xl`, then `<ul className="mt-6">` —
      each point a `li` with `hairline-b` (except last: use `divide-y divide-carbon
      [&>li]:py-3` style with 1px), `text-body font-light max-w-3xl`.
  - **Non-featured** entries: render the two as ONE row that is a nested `.rule-grid
    md:grid-cols-2`; each half `.cell-pad`: index + `.label` role + `.label-wide` period,
    company `.display text-heading-sm mt-4`, headline `text-body font-light mt-2`, points
    as the same hairline list, tech `.label-wide mt-6`.
- Numbers are plaque numbers: `01 02 03 04` across entries in encounter order.

### Impact.tsx
The stats strip as Dark Inverse Cells. `<section>` `border-b-2 border-ink`.
`.rule-grid grid-cols-2 md:grid-cols-4`; each stat cell is `.cell-ink .cell-pad-sm
md:cell-pad flex flex-col justify-between gap-6 min-h-[180px]`:
- top: `.label` (paper) — `IMPACT 0{i+1}`
- bottom: value `.display-thin text-[clamp(40px,6vw,72px)] text-paper` rendered as plain
  text `{value}{suffix}` (NO CountUp — no animation), label below `.label-wide text-paper
  max-w-[24ch] normal-case? NO — stays uppercase`.
No color, no separators beyond the rule-grid gaps.

### Skills.tsx
`<section id="toolbox">` `border-b-2 border-ink`.
- Header row identical pattern to Experience: `.label` `02 — TOOLBOX` left, `.label-wide`
  `WHAT I WORK WITH` right.
- Body: one `.rule-grid` with 5 rows (Languages / Frameworks / AI & Media / Cloud & Tools /
  Human — from `skills` keys languages, frameworks, aiMedia, cloud, soft). Each row
  `md:grid-cols-[280px_1fr]` nested rule-grid: left cell `.cell-pad-sm` `.label` category
  name; right cell `.cell-pad-sm` flex flex-wrap gap-x-6 gap-y-2 of items in
  `.display text-subheading font-light` separated typographically (no chips). Row hover:
  `group` on row, items `text-ink/60 group-hover:text-ink transition-colors` — faded large
  display text is the one allowed opacity use.

### About.tsx
`<section id="about">` `border-b-2 border-ink`.
- Header row: `.label` `03 — ABOUT` left, `.label-wide` `BELLEVUE, WA` right.
- Body `.rule-grid md:grid-cols-[380px_1fr]`:
  - Left cell: its own nested `.rule-grid grid-rows-[1fr_auto]` — top: portrait
    `<img src="/images/portrait.jpg" alt="Thirumaran Deepak">` full-bleed
    (`w-full h-full object-cover`, no padding, no frame — raw on the ground like the
    product photo); bottom: a **contact-sheet row**, nested `.rule-grid grid-cols-2`, the
    two outtake frames `/images/goofy-1.jpg` and `/images/goofy-2.jpg` (`w-full
    aspect-square object-cover`, alt "Outtake — Thirumaran pulling a face" / "Outtake —
    Thirumaran unimpressed"). Museum contact sheet: the serious print above, the outtakes
    below.
  - Right cell `.cell-pad`: `profile.summary` in `.display text-subheading md:text-heading-sm
    font-light max-w-3xl`. Below, `mt-12` two stacked blocks:
    (a) `.label` `EDUCATION` then each `education` entry as a `hairline-b` row
    (`py-4 grid md:grid-cols-[1fr_auto] gap-1`): school `text-body-lg font-light`,
    credential+detail `.label-wide text-right md:text-right`, coursework (if present)
    `text-body font-light mt-1 col-span-full`.
    (b) `mt-10` `.label` `BEYOND THE KEYBOARD` then `activities` as flex-wrap gap-[2px] of
    square tags: each `border-2 border-ink px-3 py-2 .label-wide` reading
    `{name} — {role}`.

### Contact.tsx
`<section id="contact">` — the LAST section, `border-b-0` (footer bar inside supplies the
final rule). Structure: one `.rule-grid` with rows:
1. Header row: `.label` `04 — CONTACT` left, `.label-wide` `OPEN TO WORK` right (two cells).
2. Headline cell `.cell-pad`: `<h2>` `.display-thin text-[clamp(2.5rem,7vw,6rem)]` —
   `Building something? Let’s talk.` max-w-5xl.
3. Mailing-row cell (mono's signup row): `.cell-pad` — `.label` `WRITE TO ME` then an
   underline-input-styled mailto: `<a href="mailto:...">` `hairline-b inline-flex
   items-baseline gap-4 pb-2 mt-4 text-heading-sm md:text-heading font-thin text-carbon`
   with trailing glyph `↳` — looks like mono's filled-in input. Email from `profile.email`.
4. Meta row: nested `.rule-grid md:grid-cols-3`; three cells `.cell-pad-sm`, each `.label`
   heading + `.text-link` value:
   - `LINKEDIN` → `profile.linkedinLabel` (external link rules)
   - `PHONE` → `profile.phone` as `tel:` link (strip non-digits for href)
   - `LOCATION` → `profile.location` plain span.
5. **Footer bar** (inside this file, `<footer>`): full row `bg-paper` `border-t-2
   border-ink` (this is the section's only top-border exception — it closes the page grid)
   `py-5 px-5 md:px-[45px] flex flex-wrap gap-x-8 gap-y-2 justify-between items-center`:
   left `.label-wide` `© 2026 THIRUMARAN DEEPAK`; right row of `.text-link`s:
   `LINKEDIN` (external), `EMAIL`, `TOP` (`href="#top"`).

### page.tsx (already exists — only the skip link changes)
Skip link classes become mono: `focus:bg-ink focus:text-paper focus:px-5 focus:py-3
focus:label` style, zero radius. Import order unchanged.

## Do / Don't recap (from the mono style reference)

- DO: 2px ink rules as the only container system; 0px radius; weight 100–300 headlines at
  −0.02em; 12–14px uppercase condensed labels at +0.1/+0.2em; edge-to-edge grid; white +
  ink only.
- DON'T: shadows/elevation; rounded corners; bold 600+; accent colors; gradients;
  lowercase condensed text; centered body copy; decorative entrance animation.
