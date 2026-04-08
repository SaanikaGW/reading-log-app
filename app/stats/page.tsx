'use client';

import Link from 'next/link';
import { useBooks } from '@/lib/BookContext';

export default function StatsPage() {
  const { books } = useBooks();

  const finished = books.filter(b => b.status === 'finished');
  const reading = books.filter(b => b.status === 'reading');
  const wantToRead = books.filter(b => b.status === 'want-to-read');

  const totalPages = finished.reduce((sum, b) => sum + (b.pageCount || 0), 0);
  const ratedBooks = finished.filter(b => b.rating);
  const avgRating = ratedBooks.length
    ? (ratedBooks.reduce((sum, b) => sum + b.rating!, 0) / ratedBooks.length).toFixed(1)
    : null;

  const genreCounts: Record<string, number> = {};
  finished.forEach(b => {
    if (b.genre) genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: ratedBooks.filter(b => b.rating === r).length,
  }));
  const maxRatingCount = Math.max(...ratingDist.map(r => r.count), 1);

  const statCards = [
    { label: 'Books Finished', value: finished.length, emoji: '✅' },
    { label: 'Currently Reading', value: reading.length, emoji: '📖' },
    { label: 'Want to Read', value: wantToRead.length, emoji: '🔖' },
    { label: 'Pages Read', value: totalPages.toLocaleString(), emoji: '📄' },
    { label: 'Avg Rating', value: avgRating ? `${avgRating} ★` : '–', emoji: '⭐' },
    { label: 'Total Books', value: books.length, emoji: '📚' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-3xl mb-2">📊 🍂 ☕</div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>
          Reading Stats
        </h1>
        <p className="italic text-sm" style={{ color: '#8b5e3c' }}>your reading journey at a glance</p>
        <div className="flex items-center gap-2 mt-3 max-w-xs mx-auto">
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🌿</p>
          <p className="text-xl italic mb-2" style={{ color: '#4a2c17', fontFamily: 'Georgia, serif' }}>No stats yet</p>
          <p className="mb-6 text-sm" style={{ color: '#8b5e3c' }}>add some books to see your reading journey</p>
          <Link href="/add" className="inline-block px-6 py-3 rounded-xl font-medium"
            style={{ background: '#2d1a0a', color: '#f0c988' }}>
            🌿 Log a book
          </Link>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {statCards.map(({ label, value, emoji }) => (
              <div
                key={label}
                className="rounded-2xl p-5 text-center"
                style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 8px rgba(45,26,10,0.08)' }}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>{value}</div>
                <div className="text-xs uppercase tracking-wider italic" style={{ color: '#8b5e3c' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Rating distribution */}
          {ratedBooks.length > 0 && (
            <div
              className="rounded-2xl p-6"
              style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 8px rgba(45,26,10,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span>⭐</span>
                <h2 className="text-base font-bold" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>Rating Breakdown</h2>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
              </div>
              <div className="space-y-3">
                {ratingDist.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-16 text-right italic" style={{ color: '#c9721e' }}>{'★'.repeat(rating)}</span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#e8d5b7' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(count / maxRatingCount) * 100}%`,
                          background: 'linear-gradient(90deg, #c9721e, #f0c988)',
                          minWidth: count > 0 ? '8px' : '0',
                        }}
                      />
                    </div>
                    <span className="text-sm w-4" style={{ color: '#8b5e3c' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top genres */}
          {topGenres.length > 0 && (
            <div
              className="rounded-2xl p-6"
              style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 8px rgba(45,26,10,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span>🏷️</span>
                <h2 className="text-base font-bold" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>Top Genres</h2>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {topGenres.map(([genre, count]) => (
                  <span
                    key={genre}
                    className="px-4 py-2 rounded-xl text-sm font-medium italic"
                    style={{ background: '#f5e6cc', color: '#4a2c17', border: '1px solid #d4b896' }}
                  >
                    {genre}
                    <span className="ml-2 not-italic px-1.5 py-0.5 rounded text-xs"
                      style={{ background: '#2d1a0a', color: '#f0c988' }}>
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Finished books list */}
          {finished.length > 0 && (
            <div
              className="rounded-2xl p-6"
              style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 8px rgba(45,26,10,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span>✅</span>
                <h2 className="text-base font-bold" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>Books Finished</h2>
                <div className="flex-1 border-t border-dashed" style={{ borderColor: '#d4b896' }} />
              </div>
              <div className="space-y-2">
                {finished.map(book => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="flex items-center justify-between py-2.5 px-4 rounded-xl transition-all hover:opacity-80"
                    style={{ background: '#f5e6cc', border: '1px solid #d4b896' }}
                  >
                    <div>
                      <p className="font-medium text-sm italic" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>{book.title}</p>
                      <p className="text-xs" style={{ color: '#8b5e3c' }}>{book.author}</p>
                    </div>
                    {book.rating && (
                      <span className="text-sm" style={{ color: '#c9721e' }}>{'★'.repeat(book.rating)}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
