# Reading Log

A warm, cozy personal reading journal built with **Next.js 16**, **Tailwind CSS**, **Clerk**, and **Supabase**. Track every book you're reading, have finished, or want to read — with ratings, notes, and a stats dashboard.

**Live URL:** https://reading-log-app-six.vercel.app  
**GitHub:** https://github.com/SaanikaGW/reading-log-app

---

## Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS v4
- **Auth:** Clerk (sign-up, sign-in, sign-out via `@clerk/nextjs`)
- **Database:** Supabase (PostgreSQL), scoped to logged-in user via `user_id`
- **External API:** Open Library (no key required) — search millions of books

---

## Pages

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Landing (logged out) or Shelf (logged in) — Server Component |
| `/search` | `app/search/page.tsx` | Search Open Library, save to shelf — Client Component |
| `/add` | `app/add/page.tsx` | Manually log a book — Client Component with server action |
| `/book/[id]` | `app/book/[id]/page.tsx` | Book detail + OL description — Server Component |
| `/stats` | `app/stats/page.tsx` | Reading stats dashboard — Server Component |
| `/sign-in` | `app/sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in |
| `/sign-up` | `app/sign-up/[[...sign-up]]/page.tsx` | Clerk sign-up |
| `/api/search` | `app/api/search/route.ts` | Proxies Open Library search |
| `/api/book/[key]` | `app/api/book/[key]/route.ts` | Proxies Open Library work detail |

---

## Data Model

### Supabase `books` table

```sql
id          uuid primary key
user_id     text not null         -- Clerk user ID
title       text not null
author      text not null
genre       text
page_count  integer
start_date  text
finish_date text
status      text                  -- 'reading' | 'finished' | 'want-to-read'
rating      integer               -- 1–5
notes       text
cover_image text
ol_key      text                  -- Open Library /works/OL... key
created_at  timestamptz
```

Row Level Security is enabled — users can only access their own rows.

### TypeScript type (`lib/types.ts`)

```ts
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pageCount: number;
  startDate?: string;
  finishDate?: string;
  status: 'reading' | 'finished' | 'want-to-read';
  rating?: number;
  notes?: string;
  coverImage?: string;
  ol_key?: string;
}
```

---

## Architecture

```
app/
  layout.tsx                  # ClerkProvider wrapper
  page.tsx                    # Server Component: landing or shelf
  add/page.tsx                # Client Component: manual log form
  search/page.tsx             # Client Component: Open Library search
  book/[id]/page.tsx          # Server Component: detail + OL info
  stats/page.tsx              # Server Component: stats dashboard
  sign-in/[[...sign-in]]/     # Clerk sign-in page
  sign-up/[[...sign-up]]/     # Clerk sign-up page
  api/search/route.ts         # Open Library search proxy
  api/book/[key]/route.ts     # Open Library works detail proxy
  globals.css

components/
  Nav.tsx                     # Auth-aware nav with UserButton
  ShelfClient.tsx             # Interactive shelf (filter, search, sort)
  BookDetailClient.tsx        # Delete + status update buttons
  
lib/
  actions.ts                  # Server actions: getBooks, addBook, updateBook, deleteBook
  supabase.ts                 # Supabase client factory
  types.ts                    # Book, BookStatus types

proxy.ts                      # Clerk route protection (Next.js 16)
```

---

## Style

- **Palette:** wheat `#f5e6cc` · cream `#fdf5e8` · dark brown `#2d1a0a` · amber `#c9721e` · honey `#f0c988`
- **Font:** Georgia serif throughout
- **Feel:** cozy and warm — like a well-loved notebook on a rainy afternoon

---

## Environment Variables

Required in `.env.local` (and Vercel environment settings):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```
