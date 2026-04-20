'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateBook, deleteBook } from '@/lib/actions';
import { Book, BookStatus } from '@/lib/types';

const STATUS_LABELS: Record<BookStatus, string> = {
  reading: '📖 Currently Reading',
  finished: '✅ Finished',
  'want-to-read': '🔖 Want to Read',
};

export default function BookDetailClient({ book }: { book: Book }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Remove "${book.title}" from your shelf?`)) return;
    startTransition(async () => {
      await deleteBook(book.id);
      router.push('/');
    });
  };

  const handleStatusChange = (status: BookStatus) => {
    startTransition(async () => {
      await updateBook(book.id, { status });
      router.refresh();
    });
  };

  return (
    <div className="space-y-7">
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
              onClick={() => handleStatusChange(s)}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
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

      <div className="flex items-center gap-2">
        <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
        <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/search')}
          className="flex-1 text-center py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90"
          style={{ background: '#2d1a0a', color: '#f0c988' }}
        >
          🔍 Find more books
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-5 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80 disabled:opacity-50"
          style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
        >
          {isPending ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
}
