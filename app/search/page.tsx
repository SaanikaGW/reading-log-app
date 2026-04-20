'use client';

import { useState, useTransition } from 'react';
import { addBook } from '@/lib/actions';

interface OLDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  number_of_pages_median?: number;
}

function CoverImage({ coverId, title }: { coverId?: number; title: string }) {
  if (!coverId) {
    return (
      <div className="w-full h-44 flex items-center justify-center text-4xl" style={{ background: '#e8d5b7' }}>
        📖
      </div>
    );
  }
  return (
    <img
      src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
      alt={title}
      className="w-full h-44 object-cover"
    />
  );
}

function BookResult({ doc, onSave }: { doc: OLDoc; onSave: (doc: OLDoc) => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: '#fdf5e8',
        border: '1px solid #d4b896',
        boxShadow: '0 2px 8px rgba(45,26,10,0.1)',
      }}
    >
      <div className="overflow-hidden">
        <CoverImage coverId={doc.cover_i} title={doc.title} />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3
          className="font-bold text-sm leading-snug mb-0.5 line-clamp-2 flex-1"
          style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
        >
          {doc.title}
        </h3>
        <p className="text-xs italic mb-1" style={{ color: '#8b5e3c' }}>
          {doc.author_name?.[0] ?? 'Unknown author'}
        </p>
        {doc.first_publish_year && (
          <p className="text-xs mb-2" style={{ color: '#a07850' }}>{doc.first_publish_year}</p>
        )}
        <button
          onClick={() => onSave(doc)}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 mt-auto"
          style={{ background: '#2d1a0a', color: '#f0c988' }}
        >
          + Save to Shelf
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OLDoc[]>([]);
  const [searching, setSearching] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.docs ?? []);
    } finally {
      setSearching(false);
    }
  };

  const handleSave = (doc: OLDoc) => {
    startTransition(async () => {
      await addBook({
        title: doc.title,
        author: doc.author_name?.[0] ?? 'Unknown',
        genre: '',
        pageCount: doc.number_of_pages_median ?? 0,
        status: 'want-to-read',
        coverImage: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : undefined,
        ol_key: doc.key,
      });
      setSaved(prev => new Set(prev).add(doc.key));
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <div className="text-3xl mb-2">🔍 📚 🔍</div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>
          Find Books
        </h1>
        <p className="italic text-sm" style={{ color: '#8b5e3c' }}>search millions of books via Open Library</p>
        <div className="flex items-center gap-2 mt-3 max-w-xs mx-auto">
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10 max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, author, or subject..."
          className="flex-1 px-5 py-3 rounded-xl text-sm"
          style={{ background: '#fdf5e8', border: '1px solid #d4b896', color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
        />
        <button
          type="submit"
          disabled={searching}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: '#2d1a0a', color: '#f0c988' }}
        >
          {searching ? '...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(doc => (
            saved.has(doc.key) ? (
              <div
                key={doc.key}
                className="rounded-xl overflow-hidden flex flex-col items-center justify-center min-h-[280px]"
                style={{ background: '#fdf5e8', border: '1px solid #d4b896' }}
              >
                <div className="text-3xl mb-2">✅</div>
                <p className="text-xs italic text-center px-3" style={{ color: '#2d7a3a', fontFamily: 'Georgia, serif' }}>
                  Saved to shelf!
                </p>
              </div>
            ) : (
              <BookResult
                key={doc.key}
                doc={doc}
                onSave={isPending ? () => {} : handleSave}
              />
            )
          ))}
        </div>
      )}

      {results.length === 0 && !searching && query && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🌿</p>
          <p className="italic" style={{ color: '#8b5e3c' }}>No results found — try a different search</p>
        </div>
      )}
    </div>
  );
}
