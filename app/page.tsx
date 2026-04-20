import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getBooks } from '@/lib/actions';
import ShelfClient from '@/components/ShelfClient';

export default async function ShelfPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">📚 🍂 ☕</div>
        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
        >
          Welcome to Reading Log
        </h1>
        <p className="text-lg italic mb-8" style={{ color: '#8b5e3c' }}>
          a quiet place to track your reading life
        </p>
        <div className="flex items-center gap-2 mb-10 max-w-xs mx-auto">
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        </div>
        <div
          className="rounded-2xl p-8 mb-8 text-left"
          style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 12px rgba(45,26,10,0.1)' }}
        >
          <ul className="space-y-3 text-sm" style={{ color: '#4a2c17', fontFamily: 'Georgia, serif' }}>
            <li>📖 &nbsp;Search millions of books via Open Library</li>
            <li>🔖 &nbsp;Save to your personal reading shelf</li>
            <li>✅ &nbsp;Track what you&apos;re reading, finished, and want to read</li>
            <li>⭐ &nbsp;Rate books and write personal notes</li>
            <li>📊 &nbsp;See your reading stats and trends</li>
          </ul>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 rounded-xl font-semibold text-base transition-all hover:opacity-90"
            style={{ background: '#2d1a0a', color: '#f0c988' }}
          >
            🌿 Create your shelf
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 rounded-xl font-medium text-base transition-all hover:opacity-80"
            style={{ background: '#f5e6cc', color: '#4a2c17', border: '1px solid #d4b896' }}
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const books = await getBooks();
  return <ShelfClient books={books} />;
}
