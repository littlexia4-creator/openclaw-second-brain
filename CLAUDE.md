## Commands

```bash
npm run dev          # Dev server on http://localhost:3000
npm run build        # Static export to dist/
npm run lint         # ESLint
npx tsc --noEmit     # Type check
```

## Architecture

This is a Next.js 16 App Router project that serves as a read-only personal knowledge base. It reads markdown files from an adjacent OpenClaw workspace directory and renders them in a searchable, filterable UI.

**Static export**: `next.config.ts` sets `output: 'export'`, so the app builds to static HTML/JS in `dist/`. No server runtime in production.

### Data Flow

`app/page.tsx` is the sole **Server Component**. It calls `loadAllMemories()` from `lib/memories.ts`, which reads files from disk:
- **Daily notes**: `../memory/*.md` — dates parsed from `<!-- Date: YYYY-MM-DD -->` HTML comments in content (not filenames)
- **Long-term memory**: `../MEMORY.md` — parsed with `gray-matter` for YAML frontmatter

The loaded `Memory[]` array is passed as props to `MemoryList`, a **Client Component**. All components under `components/` are client components (`'use client'`).

### Key Constraint: Hydration-Safe Dates

Dates are pre-formatted as strings (`dateFormatted`) on the server in `lib/memories.ts` before passing to client components. Client components must use `memory.dateFormatted` — never call `format(memory.date, ...)` on the client, as timezone differences between SSR and browser cause hydration mismatches.

## Key Directories & Files

```
second-brain/
├── app/
│   ├── page.tsx             — Server component entry, loads all memories
│   ├── layout.tsx           — Root layout with Geist fonts
│   └── globals.css          — Tailwind theme + prose styles
├── components/
│   ├── memory-list.tsx      — Main container; filter/search state
│   ├── memory-card.tsx      — Card in the grid view
│   ├── memory-detail.tsx    — Full content dialog with markdown rendering
│   ├── search-palette.tsx   — Cmd+K command palette (cmdk)
│   ├── filter-bar.tsx       — Type filter buttons (All/Daily/Long-term)
│   └── ui/                  — shadcn primitives (button, card, dialog, input, etc.)
├── lib/
│   ├── memories.ts          — Server-side data loading from ../memory/*.md and ../MEMORY.md
│   └── utils.ts             — cn() helper (clsx + tailwind-merge)
├── types/
│   └── memory.ts            — Memory, FilterType, SearchResult, DateRange
├── next.config.ts           — Static export (output: 'export', distDir: 'dist')
└── components.json          — shadcn/ui config (style: base-nova, icon: lucide)
```

### Types

`types/memory.ts` defines `Memory` (with `date: Date` for sorting, `dateFormatted: string` for display), `FilterType`, `SearchResult`, and `DateRange`.
