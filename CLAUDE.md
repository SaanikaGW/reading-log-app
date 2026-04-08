# Reading Log

A warm, cozy personal reading journal built with Next.js 16 + Tailwind CSS.

## What this app does

Track books you're reading, have finished, or want to read. Add details like genre, page count, dates, ratings (1–5 stars), and personal notes. Browse your shelf, view individual book details, and see reading stats.

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | **Shelf** — grid of all books, filterable by status |
| `/add` | `app/add/page.tsx` | **Add Book** — form to log a new book |
| `/book/[id]` | `app/book/[id]/page.tsx` | **Book Detail** — dynamic route for a single book |
| `/stats` | `app/stats/page.tsx` | **Stats** — reading totals, rating breakdown, genre distribution |

## Data Model

```ts
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pageCount: number;
  startDate?: string;       // ISO date string
  finishDate?: string;      // ISO date string
  status: 'reading' | 'finished' | 'want-to-read';
  rating?: number;          // 1–5
  notes?: string;
  coverImage?: string;      // URL
}
```

Data lives in React Context (client-side state only — no database yet). It resets on page refresh.

## Architecture

- **State**: `lib/BookContext.tsx` — React Context + useState, wraps the entire app in `layout.tsx`
- **Components**: `components/Nav.tsx` — sticky nav shared across all pages
- **Styling**: Tailwind CSS v4 + inline styles for the warm color palette

## Style

- **Palette**: cream background (#fdf6ee), warm browns (#5c3d2e, #3b2e1e), amber accents (#d97706), wheat highlights (#f5deb3)
- **Font**: Georgia serif throughout
- **Feel**: cozy, warm, like a well-loved notebook
