'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBooks } from '@/lib/BookContext';
import { BookStatus } from '@/lib/types';

const STATUS_LABELS: Record<BookStatus, string> = {
  'reading': 'Currently Reading',
  'finished': 'Finished',
  'want-to-read': 'Want to Read',
};

const STATUS_COLORS: Record<BookStatus, string> = {
  'reading': '#d97706',
  'finished': '#16a34a',
  'want-to-read': '#7c3aed',
};

const STATUS_BG: Record<BookStatus, string> = {
  'reading': '#fef3c7',
  'finished': '#dcfce7',
  'want-to-read': '#ede9fe',
};

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <span className="text-sm" style={{ color: '#d97706' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

function BookCard({ book }: { book: ReturnType<typeof useBooks>['books'][0] }) {
  return (
    <Link href={`/book/${book.id}`} className="block group">
      <div
        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
        style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
      >
        <div
          className="w-full h-44 flex items-center justify-center text-5xl relative overflow-hidden"
          style={{ background: book.coverImage ? 'transparent' : '#f0e0cc' }}
        >
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <span className="group-hover:scale-110 transition-transform duration-300 inline-block">📖</span>
          )}
        </div>
        <div className="p-4">
          <h3
            className="font-bold text-sm leading-snug mb-1 line-clamp-2"
            style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
          >
            {book.title}
          </h3>
          <p className="text-xs mb-3" style={{ color: '#7a5c3e' }}>{book.author}</p>
          <div className="flex items-center justify-between">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: STATUS_BG[book.status], color: STATUS_COLORS[book.status] }}
            >
              {book.status === 'reading' ? '● Reading' : book.status === 'finished' ? '✓ Done' : '○ Want'}
            </span>
            <StarRating rating={book.rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}

const FILTERS: { label: string; value: BookStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reading', value: 'reading' },
  { label: 'Finished', value: 'finished' },
  { label: 'Want to Read', value: 'want-to-read' },
];

export default function ShelfPage() {
  const { books } = useBooks();
  const [filter, setFilter] = useState<BookStatus | 'all'>('all');

  const filtered = filter === 'all' ? books : books.filter(b => b.status === filter);
  const currentlyReading = books.filter(b => b.status === 'reading');

  const counts = {
    all: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    finished: books.filter(b => b.status === 'finished').length,
    'want-to-read': books.filter(b => b.status === 'want-to-read').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Currently Reading hero */}
      {currentlyReading.length > 0 && (
        <div className="mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#a07850' }}
          >
            Currently Reading
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {currentlyReading.map(book => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="flex-1 flex gap-4 items-center rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                style={{ background: '#fff8f0', border: '2px solid #e8d5b7' }}
              >
                <div
                  className="flex-shrink-0 w-14 h-20 rounded-lg flex items-center justify-center text-3xl shadow-sm"
                  style={{ background: '#f0e0cc' }}
                >
                  {book.coverImage
                    ? <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                    : '📖'
                  }
                </div>
                <div>
                  <h3
                    className="font-bold text-base leading-tight mb-0.5"
                    style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#7a5c3e' }}>by {book.author}</p>
                  {book.pageCount > 0 && (
                    <p className="text-xs" style={{ color: '#a07850' }}>{book.pageCount} pages</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
          >
            My Shelf
          </h1>
          <p className="text-sm" style={{ color: '#a07850' }}>
            {counts.finished} finished · {counts.reading} reading · {counts['want-to-read']} to read
          </p>
        </div>
        <Link
          href="/add"
          className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
          style={{ background: '#5c3d2e', color: '#f5deb3' }}
        >
          + Add Book
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(({ label, value }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: active ? '#5c3d2e' : '#fff8f0',
                color: active ? '#f5deb3' : '#7a5c3e',
                border: `1px solid ${active ? '#5c3d2e' : '#e8d5b7'}`,
              }}
            >
              {label}
              <span
                className="ml-1.5 text-xs rounded-full px-1.5 py-0.5"
                style={{
                  background: active ? 'rgba(245,222,179,0.2)' : '#f0e0cc',
                  color: active ? '#f5deb3' : '#a07850',
                }}
              >
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📚</p>
          <p className="text-lg mb-2" style={{ color: '#5c3d2e', fontFamily: 'Georgia, serif' }}>
            Nothing here yet
          </p>
          <p className="mb-6 text-sm" style={{ color: '#a07850' }}>Add a book to get started</p>
          <Link
            href="/add"
            className="inline-block px-6 py-3 rounded-full font-medium"
            style={{ background: '#5c3d2e', color: '#f5deb3' }}
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
