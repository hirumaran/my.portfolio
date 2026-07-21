# Plan: bottom-of-viewport blur/fade on scroll

## Problem
On desktop, the next section (`Experience`) is peeking above the bottom edge while the hero is still in view. The user wants an elegant blur effect near the bottom of the viewport that hides/softens upcoming content while scrolling.

## Approach
Add a lightweight, scroll-aware bottom overlay (`ScrollBlur`) that lives on top of the page content:

- **Visual effect:** a fixed strip at the bottom of the viewport with a gradient from `var(--paper)` to transparent, plus a subtle `backdrop-blur`. This creates a soft "fog" that blurs and fades whatever content scrolls underneath it.
- **Scroll behavior:** the overlay is strong at the top of the page, but fades out as the user approaches the bottom so the final sections (Contact/About) are not permanently obscured.
- **Implementation:** use `motion/react` `useScroll` + `useTransform` to drive the opacity based on `scrollYProgress`. No extra scroll listeners.
- **Layout impact:** `pointer-events-none` so links remain clickable; `z-[40]` so it sits above page content but below the floating music island (`z-50`) and skip-link focus (`z-[100]`).
- **Hero height fix:** remove the old `56px` header offset so the hero actually fills `100dvh` on desktop, preventing the initial "Experience" peek.

## Files to change
1. `src/components/site/ScrollBlur.tsx` — new component.
2. `src/app/page.tsx` — render `<ScrollBlur />` after `<main>`.
3. `src/components/site/Hero.tsx` — update `min-h` and remove the `-mt-3` island nudge if needed.

## Trade-off noted
The overlay is full-width, so it will also softly blur the bottom edge of the terminal column. If that becomes unwanted, we can restrict it to the content columns later with a grid-aware overlay, but that adds responsive complexity.
