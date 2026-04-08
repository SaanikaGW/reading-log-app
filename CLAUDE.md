# Reading Log

A warm, cozy personal reading journal built with **Next.js 16** and **Tailwind CSS**. Track every book you're reading, have finished, or want to read — with ratings, notes, dates, and a stats dashboard.

**Live URL:** https://reading-log-app-six.vercel.app  
**GitHub:** https://github.com/SaanikaGW/reading-log-app

---

## Project Overview

This app is a client-side reading tracker. All data lives in React Context (in-memory state) — no database yet. It resets on page refresh. The goal is to exercise Next.js routing, component architecture, forms, and Tailwind styling.

---

## Pages

### `/` — Shelf (homepage)
**File:** `app/page.tsx`  
The main view. Displays all books as a warm card grid. Features:
- "Currently Reading" hero section at the top
- Filter tabs: All / Reading / Finished / Want to Read
- Live search by title or author
- Each card links to the book's detail page

### `/add` — Add a Book
**File:** `app/add/page.tsx`  
A form to log a new book. Fields: title, author, genre, page count, status, start/finish dates, star rating (interactive), notes, and optional cover image URL. On submit, adds the book to context state and redirects to the shelf.

### `/book/[id]` — Book Detail
**File:** `app/book/[id]/page.tsx`  
Dynamic route. Displays full details for a single book: cover, title, author, genre, page count, dates, rating, and personal notes. Allows updating status and deleting the book. Uses React's `use(params)` to read the dynamic segment (Next.js 16 convention).

### `/stats` — Reading Stats
**File:** `app/stats/page.tsx`  
A dashboard showing: total books finished, currently reading, want-to-read, total pages read, average rating, top genres, rating distribution (bar chart), and a list of finished books.

---

## Data Model

```ts
interface Book {
  id: string;           // timestamp-based unique ID
  title: string;
  author: string;
  genre: string;
  pageCount: number;
  startDate?: string;   // ISO date string e.g. "2024-01-15"
  finishDate?: string;  // ISO date string
  status: 'reading' | 'finished' | 'want-to-read';
  rating?: number;      // 1–5 stars
  notes?: string;       // personal review / thoughts
  coverImage?: string;  // optional image URL
}
```

State is managed in `lib/BookContext.tsx` using React Context + `useState`. The context wraps the entire app via `app/layout.tsx`. Four sample books are pre-loaded so the app isn't empty on first load.

---

## Architecture

```
app/
  layout.tsx          # Root layout: wraps app in BookProvider, renders Nav
  page.tsx            # Shelf page (client component)
  add/page.tsx        # Add book form (client component)
  book/[id]/page.tsx  # Book detail — dynamic route (client component)
  stats/page.tsx      # Stats dashboard (client component)
  globals.css         # Global styles + Tailwind import

components/
  Nav.tsx             # Sticky top nav with active link highlighting

lib/
  BookContext.tsx     # React Context: books state + addBook/updateBook/deleteBook/getBook
  types.ts            # TypeScript types: Book, BookStatus

.claude/
  settings.json       # Playwright MCP config for browser testing
```

All pages are Client Components (`'use client'`) because they read from React Context.

---

## Style

- **Palette:** cream `#fdf6ee` · dark brown `#3b2e1e` · warm brown `#5c3d2e` · amber `#d97706` · wheat `#f5deb3`
- **Font:** Georgia serif throughout
- **Feel:** cozy and warm — like a well-loved notebook on a rainy afternoon
- **Cards:** rounded corners, soft shadows, warm hover lift effect

---

## Key Conventions

- Dynamic route params use `use(params)` from React (Next.js 16 client component pattern)
- No `useEffect` for data — all state lives in Context and is passed via props or consumed directly
- Tailwind v4 with `@import "tailwindcss"` in globals.css (no config file needed)
