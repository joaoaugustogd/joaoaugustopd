# João Augusto — Portfolio

Personal portfolio site. React 19 + TypeScript + Vite 7, Tailwind v4, Motion
(Framer Motion) and Lenis. Deploys itself to GitHub Pages on every push to
`main`.

**Design direction — "Editorial Noir":** a printed design annual rendered in a
dark room. Ink-black stock, warm paper inversions for the work index, one
vermilion accent used strictly as punctuation. Instrument Serif for voice,
Instrument Sans for reading, JetBrains Mono for machine metadata.

---

## 1. Get it running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into /dist
npm run preview  # serve the production build locally
```

Node 20 or newer.

---

### Blank page? Read this first

A React + Vite project is source code, not a website. Two things cause a blank
screen:

**1. You opened `index.html` directly.** It can't work. That file contains
`<script type="module" src="/src/main.tsx">` — a TypeScript file no browser can
execute. Vite compiles it on the fly. There is nothing to see until a dev server
is running.

**2. You skipped `npm install`.** Without `node_modules`, `npm run dev` can't
start. This is the usual cause.

```bash
cd joao-augusto-portfolio
npm install      # once, ~30s
npm run dev      # then open the http://localhost:5173 URL it prints
```

**Want to look at it right now with no tooling at all?** Open
`preview-offline/index.html` — one self-contained file (CSS, JS and all imagery
inlined; zero external requests) that works by double-clicking or dropped into
any preview pane. Regenerate it after content edits with `npm run build:offline`.
It's a preview, not the deploy artifact: GitHub Pages builds from source via the
Action.

### Where it can run

The app picks its router by capability probe, so the same build works in three
very different contexts. Worth knowing if you ever see a routing oddity:

| Context | Router | Deep links | Notes |
| --- | --- | --- | --- |
| `http(s)` — dev server, GitHub Pages | `BrowserRouter` | ✅ | Clean `/work/slug` URLs. The real target. |
| `file://` — double-clicked from disk | `HashRouter` | ✅ | URLs become `#/work/slug`; no server to rewrite paths. |
| Sandboxed preview frame (`srcdoc`, `blob:`) | `MemoryRouter` | ❌ | `origin` is the string `"null"` and paths can't be resolved against it, so history is kept in memory. In-app navigation works; browser back/forward doesn't. |

Section links (Work / Process / About / Contact) are handled programmatically by
`components/SectionLink.tsx` rather than as `href="/#work"` anchors — under hash
routing that href *is* a route and would land on the 404 page.

---

## 2. Push it to GitHub

The repo already has its first commit — but on a branch called `master`, while
the deploy workflow watches `main`. Rename it first or nothing will ever build:

```bash
git branch -M main                                        # ← don't skip this
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then, once, in the repo on github.com:

**Settings → Pages → Build and deployment → Source → “GitHub Actions”.**

That's the whole setup. `.github/workflows/deploy.yml` builds and publishes on
every push to `main`, and it works out which base path to use on its own:

| Where it lives | Base path | You do |
| --- | --- | --- |
| `github.com/you/portfolio` | `/portfolio/` | nothing |
| `github.com/you/you.github.io` | `/` | nothing |
| Custom domain | `/` | add `public/CNAME` containing `yourdomain.com` |

Deep links like `/work/pay-the-pyper` work because the build writes a `404.html`
copy of `index.html`, which is how GitHub Pages supports client-side routing.

---

## 3. Make it yours

Everything you need to edit is in **two content files**. No component changes
required.

### `src/data/profile.ts`
Name, role, headline, standfirst, about paragraphs, stats, capability groups,
tool list, experience timeline, process phases, and social links.

### `src/data/projects.ts`
One object per case study. The work index, the `/work/:slug` routes and the
"next case study" links are all derived from this array — add, remove or reorder
freely.

Each case study's narrative is an array of `blocks`, so you write content rather
than JSX:

```ts
{ kind: "text",  heading: "The problem", body: "…" }
{ kind: "list",  heading: "What research told us", items: ["…", "…"] }
{ kind: "image", src: "projects/flow.svg", alt: "…", caption: "…", ratio: "16 / 9" }
{ kind: "quote", body: "…", caption: "Reception lead, 11 years in role" }
```

### ⚠️ Replace the placeholder copy

Anything marked `[PLACEHOLDER]` is scaffolding — real structure, invented
specifics. In particular: the metrics on Field Ops, Clinic OS and Ledger, three
of the four timeline entries, and the LinkedIn / Read.cv / Dribbble URLs.
**A case study with honest, modest numbers beats one with impressive numbers a
reader can tell you made up.**

### Images

Drop real exports into `public/` using the same filenames and nothing else
changes:

| File | What it is |
| --- | --- |
| `public/portrait.svg` | Your photo. Swap for `portrait.jpg` and update the `src` in `src/sections/About.tsx`. |
| `public/projects/*-cover.svg` | Case study covers, 16:9. |
| `public/projects/*.svg` | In-narrative diagrams. |
| `public/og.png` | Social share card, 1200×630. |

The shipped images are procedurally generated abstract "UI plates" — they carry
the palette and grid so the site reads as finished, but nobody would mistake
them for real product screens. **Replace them with your actual Figma exports.**

Reference images by their path inside `public/` (`"projects/cover.svg"`), never
with a leading `./` or `/` — `src/lib/asset.ts` resolves them against the deploy
base path, which is what makes them work both at a domain root and under
`/repo-name/`.

---

## 4. How the motion is built

Motion is the portfolio's argument, so it's structured rather than sprinkled.

| Layer | Where | What it does |
| --- | --- | --- |
| Tokens | `src/lib/motion.ts` | Named curves and durations. Components never inline a bezier. |
| Smooth scroll | `components/SmoothScroll.tsx` | Lenis wired into the same RAF as Motion, so scroll-linked animation resolves in the same frame. |
| Text | `components/SplitText.tsx` | Character- and word-level masked reveals. `aria-label` carries the readable string so screen readers don't spell it out. |
| Images | `components/MaskImage.tsx` | Clip-path wipe (one-shot) + over-scaled parallax drift (continuous). |
| Pointer | `components/Cursor.tsx`, `Magnetic.tsx` | Custom cursor and magnetic hover. Any element opts in with `data-cursor="view"` and `data-cursor-label="…"`. |
| Sections | `sections/Process.tsx`, `sections/Work.tsx` | A pinned phase index against scrolling copy; a hover index with a cursor-tracking preview plate. |
| Routes | `components/RouteCurtain.tsx` | Vermilion curtain sweep on navigation, decoupled from page cross-fade. |

**Accessibility is built in, not bolted on.** `prefers-reduced-motion` disables
Lenis, all transforms, parallax, the grain overlay and the custom cursor while
keeping opacity and colour transitions. The custom cursor and magnetic hover
only mount for fine pointers, so touch users get native behaviour. Every
interactive element keeps a visible focus ring, there's a skip link, and the
`--color-bone-45` token is set at 55% alpha specifically because 45% measured
4.06:1 against the ink surface and failed WCAG AA.

---

## 5. Structure

```
src/
├─ data/            ← the only files you need to edit
│  ├─ profile.ts
│  └─ projects.ts
├─ styles/
│  └─ index.css     ← design tokens (@theme) + custom utilities
├─ lib/
│  ├─ motion.ts     ← easing / duration tokens, shared variants
│  ├─ asset.ts      ← base-path-safe public asset resolver
│  └─ useHasPointer.ts
├─ components/      ← motion primitives + chrome
├─ sections/        ← Hero, Work, Process, About, Capabilities, Contact
├─ pages/           ← Home, CaseStudy, NotFound
├─ App.tsx          ← overlay stack, routes, page transitions
└─ main.tsx
```

### Design tokens

All in the `@theme` block of `src/styles/index.css`: colour, the fluid type
scale (`text-mega` → `text-meta`), easing curves, gutter spacing. Two custom
utilities carry most of the layout: `gutter` (page horizontal rhythm) and
`invert-surface` (flips the whole token surface to paper, so children need no
conditional classes).

Type scale ceilings are set by the longest string that must fit on one line at
1440px — not by what looks biggest in isolation. If you write a longer headline,
check it at that width.

---

## 6. Known trade-offs

- **Bundle is ~449 kB / 144 kB gzipped.** Motion and React Router are the bulk
  of it. Acceptable for a portfolio where motion *is* the content; if you want
  it smaller, lazy-load the case study route.
- **Fonts come from Google Fonts.** Self-host them (`public/fonts/` +
  `@font-face`) if you want zero third-party requests and a faster first paint.
- **No CMS.** Content is typed TypeScript, which means it's version-controlled
  and can't be malformed — but you edit it in an editor, not a browser.
