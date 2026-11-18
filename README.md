# Atharva Gupta — Portfolio

Next.js 14 · TypeScript · Tailwind CSS · Framer Motion

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Editing content

**All text, metrics, links and projects live in [`lib/data.ts`](lib/data.ts).** Empty links are hidden automatically, so fill them in and they appear across the hero, terminal, command palette and footer:

- `profile.links.github` / `linkedin` / `leetcode`
- `profile.links.resume`: drop `resume.pdf` into `/public` and set `"/resume.pdf"`
- `projects[].live` / `projects[].repo`: when empty, the card shows "Ask me for a walkthrough"
- `profile.available` / `profile.availability`: the green status badge

## Features

- **Live routing simulation** in the hero, modelled on the CortexStak routing layer (least-load routing, caching, failover, live logs)
- **Interactive terminal** in About (`help`, `projects`, `hire`, ↑ history, Tab completion)
- **Command palette**: `Ctrl/⌘ + K`
- Animated product mockups for Attendify, GROEI and Dispatch (only animate while on screen)
- Scroll progress bar, active-section nav, scroll-drawn experience timeline, counters, spotlight cards, magnetic buttons
- Copy-email with toast, live IST clock, full mobile menu, `prefers-reduced-motion` support

## Structure

```
app/            layout (fonts, SEO), page, globals.css, icon.svg
components/     hero, system-graph, impact, about, terminal, experience,
                projects, mockups, skills, achievements, contact, nav,
                command-palette, ui (shared primitives)
lib/data.ts     every word on the site
```
