'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBooks } from '@/lib/BookContext';
import { BookStatus } from '@/lib/types';

const STATUS_COLORS: Record<BookStatus, string> = {
  'reading': '#c9721e',
  'finished': '#2d7a3a',
  'want-to-read': '#5c3d8f',
};

const STATUS_BG: Record<BookStatus, string> = {
  'reading': '#fef3c7',
  'finished': '#dcfce7',
  'want-to-read': '#ede9fe',
};

const STATUS_STICKER: Record<BookStatus, string> = {
  'reading': '📖',
  'finished': '✅',
  'want-to-read': '🔖',
};

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <span style={{ color: '#c9721e', fontSize: '12px' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

function BookCard({ book }: { book: ReturnType<typeof useBooks>['books'][0] }) {
  return (
    <Link href={`/book/${book.id}`} className="block group">
      <div
        className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        style={{
          background: '#fdf5e8',
          border: '1px solid #d4b896',
          boxShadow: '0 2px 8px rgba(45,26,10,0.12)',
        }}
      >
        {/* Book cover */}
        <div
          className="w-full h-44 flex items-center justify-center relative overflow-hidden"
          style={{ background: book.coverImage ? 'transparent' : '#e8d5b7' }}
        >
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300">📖</div>
              {book.genre && (
                <div className="text-xs px-2 text-center leading-tight" style={{ color: '#8b5e3c', fontStyle: 'italic' }}>
                  {book.genre}
                </div>
              )}
            </div>
          )}
          {/* Status sticker */}
          <div
            className="absolute top-2 right-2 text-lg"
            title={book.status}
          >
            {STATUS_STICKER[book.status]}
          </div>
        </div>

        {/* Book spine accent */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${STATUS_COLORS[book.status]}, #f0c988)` }} />

        {/* Info */}
        <div className="p-3">
          <h3
            className="font-bold text-sm leading-snug mb-0.5 line-clamp-2"
            style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
          >
            {book.title}
          </h3>
          <p className="text-xs mb-2 italic" style={{ color: '#8b5e3c' }}>{book.author}</p>
          <StarRating rating={book.rating} />
        </div>
      </div>
    </Link>
  );
}

const FILTERS: { label: string; value: BookStatus | 'all'; sticker: string }[] = [
  { label: 'All Books', value: 'all', sticker: '📚' },
  { label: 'Reading', value: 'reading', sticker: '📖' },
  { label: 'Finished', value: 'finished', sticker: '✅' },
  { label: 'Want to Read', value: 'want-to-read', sticker: '🔖' },
];

function SectionHeader({ sticker, title }: { sticker: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xl">{sticker}</span>
      <h2 className="text-lg font-bold" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>
        {title}
      </h2>
      <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
    </div>
  );
}

export default function ShelfPage() {
  const { books } = useBooks();
  const [filter, setFilter] = useState<BookStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = books
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b =>
      !search.trim() ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    );

  const currentlyReading = books.filter(b => b.status === 'reading');

  const counts = {
    all: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    finished: books.filter(b => b.status === 'finished').length,
    'want-to-read': books.filter(b => b.status === 'want-to-read').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Page header */}
      <div className="mb-8 text-center">
        <div className="text-4xl mb-2">🍂 📚 🍂</div>
        <h1
          className="text-4xl font-bold mb-1"
          style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
        >
          My Reading Shelf
        </h1>
        <p className="italic text-sm" style={{ color: '#8b5e3c' }}>
          {counts.finished} finished · {counts.reading} reading · {counts['want-to-read']} to read
        </p>
        <div className="flex items-center gap-2 mt-3 max-w-xs mx-auto">
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        </div>
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div
          className="mb-10 rounded-2xl p-6"
          style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 8px rgba(45,26,10,0.08)' }}
        >
          <SectionHeader sticker="☕" title="Currently Reading" />
          <div className="flex flex-col sm:flex-row gap-4">
            {currentlyReading.map(book => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="flex-1 flex gap-4 items-center rounded-xl p-4 transition-all hover:shadow-md"
                style={{ background: '#f5e6cc', border: '1px solid #d4b896' }}
              >
                <div
                  className="flex-shrink-0 w-12 h-16 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                  style={{ background: '#e8d5b7' }}
                >
                  {book.coverImage
                    ? <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                    : '📖'
                  }
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight mb-0.5" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>
                    {book.title}
                  </h3>
                  <p className="text-xs italic mb-1" style={{ color: '#8b5e3c' }}>by {book.author}</p>
                  {book.pageCount > 0 && (
                    <p className="text-xs" style={{ color: '#a07850' }}>📄 {book.pageCount} pages</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
        <input
          type="text"
          placeholder="🔍  search by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm flex-1 sm:max-w-72"
          style={{
            background: '#fdf5e8',
            border: '1px solid #d4b896',
            color: '#2d1a0a',
          }}
        />
        <Link
          href="/add"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
          style={{ background: '#2d1a0a', color: '#f0c988', border: '1px solid #4a2c17' }}
        >
          🌿 Log a Book
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(({ label, value, sticker }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? '#4a2c17' : '#fdf5e8',
                color: active ? '#f0c988' : '#8b5e3c',
                border: `1px solid ${active ? '#4a2c17' : '#d4b896'}`,
              }}
            >
              {sticker} {label}
              <span
                className="ml-1.5 text-xs rounded-full px-1.5 py-0.5"
                style={{
                  background: active ? 'rgba(240,201,136,0.2)' : '#e8d5b7',
                  color: active ? '#f0c988' : '#8b5e3c',
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
          <p className="text-6xl mb-4">🌿</p>
          <p className="text-xl mb-2 italic" style={{ color: '#4a2c17', fontFamily: 'Georgia, serif' }}>
            Nothing here yet
          </p>
          <p className="mb-6 text-sm" style={{ color: '#8b5e3c' }}>your shelf is waiting to be filled</p>
          <Link
            href="/add"
            className="inline-block px-6 py-3 rounded-xl font-medium"
            style={{ background: '#2d1a0a', color: '#f0c988' }}
          >
            🌿 Log your first book
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
