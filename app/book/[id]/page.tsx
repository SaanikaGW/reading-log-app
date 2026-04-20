import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBook } from '@/lib/actions';
import { BookStatus } from '@/lib/types';
import BookDetailClient from '@/components/BookDetailClient';

const STATUS_LABELS: Record<BookStatus, string> = {
  reading: '📖 Currently Reading',
  finished: '✅ Finished',
  'want-to-read': '🔖 Want to Read',
};

interface OLDetail {
  description?: string | { value: string };
  subjects?: string[];
  first_sentence?: { value: string };
}

async function getOLDetail(olKey: string): Promise<OLDetail | null> {
  try {
    const res = await fetch(`https://openlibrary.org${olKey}.json`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const olDetail = book.ol_key ? await getOLDetail(book.ol_key) : null;
  const description = olDetail?.description
    ? typeof olDetail.description === 'string'
      ? olDetail.description
      : olDetail.description.value
    : null;
  const subjects = olDetail?.subjects?.slice(0, 6) ?? [];

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
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #2d1a0a, #c9721e, #f0c988)' }} />

        <div className="flex gap-6 p-8" style={{ background: '#f5e6cc', borderBottom: '1px solid #d4b896' }}>
          <div
            className="flex-shrink-0 w-28 h-40 rounded-xl flex items-center justify-center text-4xl shadow-lg overflow-hidden"
            style={{ background: book.coverImage ? 'transparent' : '#e8d5b7', border: '1px solid #d4b896' }}
          >
            {book.coverImage
              ? <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              : '📖'
            }
          </div>

          <div className="flex-1 min-w-0">
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
          {/* Stats row */}
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

          {/* Personal notes */}
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
                  &ldquo;{book.notes}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Open Library description */}
          {description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span>📖</span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5e3c' }}>About this Book</span>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: '#4a2c17', fontFamily: 'Georgia, serif' }}>
                {description.length > 500 ? description.slice(0, 500) + '...' : description}
              </p>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span>🏷️</span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5e3c' }}>Subjects</span>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1 rounded-xl italic"
                    style={{ background: '#f5e6cc', color: '#4a2c17', border: '1px solid #d4b896' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <BookDetailClient book={book} />
        </div>
      </div>
    </div>
  );
}
