'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getBook, deleteBook, updateBook } = useBooks();
  const router = useRouter();
  const book = getBook(id);

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}>
          Book not found
        </h2>
        <Link href="/" style={{ color: '#a07850' }}>← Back to shelf</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Remove "${book.title}" from your shelf?`)) {
      deleteBook(id);
      router.push('/');
    }
  };

  const handleStatusChange = (status: BookStatus) => {
    updateBook(id, { status });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: '#a07850' }}
      >
        ← Back to shelf
      </Link>

      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
      >
        {/* Top: cover + title block */}
        <div
          className="flex gap-6 p-8"
          style={{ background: '#f5e6d0', borderBottom: '1px solid #e8d5b7' }}
        >
          {/* Cover */}
          <div
            className="flex-shrink-0 w-28 h-40 rounded-xl flex items-center justify-center text-4xl shadow-md"
            style={{ background: book.coverImage ? 'transparent' : '#e8d5b7' }}
          >
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-xl" />
            ) : (
              '📖'
            )}
          </div>

          {/* Title info */}
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-bold leading-tight mb-1"
              style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
            >
              {book.title}
            </h1>
            <p className="text-base mb-3" style={{ color: '#7a5c3e' }}>by {book.author}</p>

            {/* Status badge */}
            <span
              className="inline-block text-sm px-3 py-1 rounded-full font-medium mb-3"
              style={{
                background: STATUS_BG[book.status],
                color: STATUS_COLORS[book.status],
              }}
            >
              {STATUS_LABELS[book.status]}
            </span>

            {/* Rating */}
            {book.rating && (
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className="text-xl" style={{ color: n <= book.rating! ? '#d97706' : '#e8d5b7' }}>★</span>
                ))}
              </div>
            )}

            {book.genre && (
              <p className="text-sm" style={{ color: '#a07850' }}>{book.genre}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4">
            {book.pageCount > 0 && (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: '#f5e6d0' }}
              >
                <p className="text-2xl font-bold" style={{ color: '#5c3d2e', fontFamily: 'Georgia, serif' }}>
                  {book.pageCount.toLocaleString()}
                </p>
                <p className="text-xs mt-1" style={{ color: '#a07850' }}>pages</p>
              </div>
            )}
            {book.startDate && (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: '#f5e6d0' }}
              >
                <p className="text-base font-semibold" style={{ color: '#5c3d2e' }}>
                  {new Date(book.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs mt-1" style={{ color: '#a07850' }}>started</p>
              </div>
            )}
            {book.finishDate && (
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: '#f5e6d0' }}
              >
                <p className="text-base font-semibold" style={{ color: '#5c3d2e' }}>
                  {new Date(book.finishDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs mt-1" style={{ color: '#a07850' }}>finished</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {book.notes && (
            <div>
              <h3
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: '#7a5c3e' }}
              >
                Notes & Thoughts
              </h3>
              <p
                className="leading-relaxed italic"
                style={{ color: '#5c3d2e', fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
              >
                "{book.notes}"
              </p>
            </div>
          )}

          {/* Change status */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#7a5c3e' }}
            >
              Update Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['want-to-read', 'reading', 'finished'] as BookStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: book.status === s ? STATUS_COLORS[s] : '#f0e0cc',
                    color: book.status === s ? '#fff' : '#7a5c3e',
                    border: `1px solid ${book.status === s ? STATUS_COLORS[s] : '#e8d5b7'}`,
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/add"
              className="flex-1 text-center py-3 rounded-full font-medium text-sm transition-all hover:opacity-90"
              style={{ background: '#5c3d2e', color: '#f5deb3' }}
            >
              Add another book
            </Link>
            <button
              onClick={handleDelete}
              className="px-5 py-3 rounded-full font-medium text-sm transition-all hover:opacity-80"
              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
