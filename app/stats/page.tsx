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

  // Genre breakdown
  const genreCounts: Record<string, number> = {};
  finished.forEach(b => {
    if (b.genre) {
      genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    }
  });
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: ratedBooks.filter(b => b.rating === r).length,
  }));
  const maxRatingCount = Math.max(...ratingDist.map(r => r.count), 1);

  const statCards = [
    { label: 'Books Finished', value: finished.length, emoji: '✅' },
    { label: 'Currently Reading', value: reading.length, emoji: '📖' },
    { label: 'Want to Read', value: wantToRead.length, emoji: '📋' },
    { label: 'Pages Read', value: totalPages.toLocaleString(), emoji: '📄' },
    { label: 'Avg Rating', value: avgRating ? `${avgRating} ★` : '–', emoji: '⭐' },
    { label: 'Total Books', value: books.length, emoji: '📚' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
        >
          Reading Stats
        </h1>
        <p style={{ color: '#a07850' }}>Your reading journey at a glance</p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📊</p>
          <p className="text-lg mb-2" style={{ color: '#5c3d2e', fontFamily: 'Georgia, serif' }}>
            No stats yet
          </p>
          <p className="mb-6" style={{ color: '#a07850' }}>Add some books to see your reading stats</p>
          <Link
            href="/add"
            className="inline-block px-6 py-3 rounded-full font-medium"
            style={{ background: '#5c3d2e', color: '#f5deb3' }}
          >
            Add a book
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {statCards.map(({ label, value, emoji }) => (
              <div
                key={label}
                className="rounded-2xl p-5 text-center shadow-sm"
                style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: '#5c3d2e', fontFamily: 'Georgia, serif' }}
                >
                  {value}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: '#a07850' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Rating distribution */}
          {ratedBooks.length > 0 && (
            <div
              className="rounded-2xl p-6 shadow-sm"
              style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
            >
              <h2
                className="text-lg font-bold mb-5"
                style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
              >
                Rating Breakdown
              </h2>
              <div className="space-y-3">
                {ratingDist.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-6 text-right" style={{ color: '#d97706' }}>
                      {'★'.repeat(rating)}
                    </span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: '#f0e0cc' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(count / maxRatingCount) * 100}%`,
                          background: '#d97706',
                          minWidth: count > 0 ? '8px' : '0',
                        }}
                      />
                    </div>
                    <span className="text-sm w-4" style={{ color: '#7a5c3e' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top genres */}
          {topGenres.length > 0 && (
            <div
              className="rounded-2xl p-6 shadow-sm"
              style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
            >
              <h2
                className="text-lg font-bold mb-5"
                style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
              >
                Top Genres (Finished)
              </h2>
              <div className="flex flex-wrap gap-2">
                {topGenres.map(([genre, count]) => (
                  <span
                    key={genre}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ background: '#f0e0cc', color: '#5c3d2e', border: '1px solid #e8d5b7' }}
                  >
                    {genre}
                    <span
                      className="ml-2 px-1.5 py-0.5 rounded-full text-xs"
                      style={{ background: '#5c3d2e', color: '#f5deb3' }}
                    >
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recently finished */}
          {finished.length > 0 && (
            <div
              className="rounded-2xl p-6 shadow-sm"
              style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
            >
              <h2
                className="text-lg font-bold mb-5"
                style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
              >
                Finished Books
              </h2>
              <div className="space-y-3">
                {finished.map(book => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-xl transition-all hover:opacity-80"
                    style={{ background: '#f5e6d0' }}
                  >
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}>
                        {book.title}
                      </p>
                      <p className="text-xs" style={{ color: '#a07850' }}>{book.author}</p>
                    </div>
                    {book.rating && (
                      <span className="text-sm" style={{ color: '#d97706' }}>
                        {'★'.repeat(book.rating)}
                      </span>
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
