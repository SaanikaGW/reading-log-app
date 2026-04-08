'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/lib/BookContext';
import { BookStatus } from '@/lib/types';

const STATUS_LABELS: Record<BookStatus, string> = {
  'reading': '📖 Currently Reading',
  'finished': '✅ Finished',
  'want-to-read': '🔖 Want to Read',
};

const STATUS_COLORS: Record<BookStatus, string> = {
  'reading': '#c9721e',
  'finished': '#2d7a3a',
  'want-to-read': '#5c3d8f',
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
        <h2 className="text-2xl font-bold mb-2 italic" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>
          Book not found
        </h2>
        <Link href="/" style={{ color: '#8b5e3c' }}>← back to shelf</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Remove "${book.title}" from your shelf?`)) {
      deleteBook(id);
      router.push('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-8 italic hover:opacity-70 transition-opacity"
        style={{ color: '#8b5e3c' }}
      >
        ← back to shelf
      </Link>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 4px 16px rgba(45,26,10,0.12)' }}
      >
        {/* Header band */}
        <div style={{ height: '4px', background: `linear-gradient(90deg, #2d1a0a, #c9721e, #f0c988)` }} />

        {/* Cover + title */}
        <div className="flex gap-6 p-8" style={{ background: '#f5e6cc', borderBottom: '1px solid #d4b896' }}>
          <div
            className="flex-shrink-0 w-28 h-40 rounded-xl flex items-center justify-center text-4xl shadow-lg"
            style={{ background: book.coverImage ? 'transparent' : '#e8d5b7', border: '1px solid #d4b896' }}
          >
            {book.coverImage
              ? <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-xl" />
              : '📖'
            }
          </div>

          <div className="flex-1 min-w-0">
            {/* Decorative top */}
            <div className="text-lg mb-2">🌿</div>

            <h1
              className="text-2xl font-bold leading-tight mb-1"
              style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
            >
              {book.title}
            </h1>
            <p className="italic mb-3" style={{ color: '#8b5e3c' }}>by {book.author}</p>

            <span
              className="inline-block text-sm px-3 py-1 rounded-lg font-medium mb-3"
              style={{ background: '#2d1a0a', color: '#f0c988' }}
            >
              {STATUS_LABELS[book.status]}
            </span>

            {book.rating && (
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className="text-xl" style={{ color: n <= book.rating! ? '#c9721e' : '#d4b896' }}>★</span>
                ))}
              </div>
            )}

            {book.genre && (
              <p className="text-sm italic" style={{ color: '#a07850' }}>🏷️ {book.genre}</p>
            )}
          </div>
        </div>

        <div className="p-8 space-y-7">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {book.pageCount > 0 && (
              <div className="rounded-xl p-3 text-center" style={{ background: '#f5e6cc', border: '1px solid #d4b896' }}>
                <div className="text-xl mb-1">📄</div>
                <p className="text-lg font-bold" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>{book.pageCount.toLocaleString()}</p>
                <p className="text-xs italic" style={{ color: '#8b5e3c' }}>pages</p>
              </div>
            )}
            {book.startDate && (
              <div className="rounded-xl p-3 text-center" style={{ background: '#f5e6cc', border: '1px solid #d4b896' }}>
                <div className="text-xl mb-1">🌱</div>
                <p className="text-sm font-semibold" style={{ color: '#2d1a0a' }}>
                  {new Date(book.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs italic" style={{ color: '#8b5e3c' }}>started</p>
              </div>
            )}
            {book.finishDate && (
              <div className="rounded-xl p-3 text-center" style={{ background: '#f5e6cc', border: '1px solid #d4b896' }}>
                <div className="text-xl mb-1">🍂</div>
                <p className="text-sm font-semibold" style={{ color: '#2d1a0a' }}>
                  {new Date(book.finishDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs italic" style={{ color: '#8b5e3c' }}>finished</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {book.notes && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span>🖊️</span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5e3c' }}>My Notes</span>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
              </div>
              <div
                className="rounded-xl p-5"
                style={{ background: '#f5e6cc', border: '1px solid #d4b896', borderLeft: '3px solid #c9721e' }}
              >
                <p className="italic leading-relaxed" style={{ color: '#4a2c17', fontFamily: 'Georgia, serif', lineHeight: '1.9' }}>
                  "{book.notes}"
                </p>
              </div>
            </div>
          )}

          {/* Update status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span>📌</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5e3c' }}>Update Status</span>
              <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['want-to-read', 'reading', 'finished'] as BookStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => updateBook(id, { status: s })}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    background: book.status === s ? '#2d1a0a' : '#f5e6cc',
                    color: book.status === s ? '#f0c988' : '#8b5e3c',
                    border: `1px solid ${book.status === s ? '#2d1a0a' : '#d4b896'}`,
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
            <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
            <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/add"
              className="flex-1 text-center py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90"
              style={{ background: '#2d1a0a', color: '#f0c988' }}
            >
              🌿 Log another book
            </Link>
            <button
              onClick={handleDelete}
              className="px-5 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80"
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
