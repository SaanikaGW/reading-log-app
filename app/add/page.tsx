'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/lib/BookContext';
import { BookStatus } from '@/lib/types';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #d4b896',
  background: '#fdf5e8',
  color: '#2d1a0a',
  fontFamily: 'Georgia, serif',
  fontSize: '15px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '12px',
  fontWeight: '600',
  color: '#8b5e3c',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

export default function AddBookPage() {
  const { addBook } = useBooks();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    pageCount: '',
    startDate: '',
    finishDate: '',
    status: 'want-to-read' as BookStatus,
    rating: '',
    notes: '',
    coverImage: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;

    addBook({
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      pageCount: form.pageCount ? parseInt(form.pageCount) : 0,
      startDate: form.startDate || undefined,
      finishDate: form.finishDate || undefined,
      status: form.status,
      rating: form.rating ? parseInt(form.rating) : undefined,
      notes: form.notes.trim() || undefined,
      coverImage: form.coverImage.trim() || undefined,
    });

    setSubmitted(true);
    setTimeout(() => router.push('/'), 1200);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h2 className="text-2xl font-bold mb-2 italic" style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}>
          Added to your shelf!
        </h2>
        <p className="italic" style={{ color: '#8b5e3c' }}>heading back to your books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-3xl mb-2">🌿 📖 🌿</div>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: '#2d1a0a', fontFamily: 'Georgia, serif' }}
        >
          Log a New Book
        </h1>
        <p className="italic text-sm" style={{ color: '#8b5e3c' }}>add it to your reading shelf</p>
        <div className="flex items-center gap-2 mt-3 max-w-xs mx-auto">
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          <span className="text-xs" style={{ color: '#c9721e' }}>✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-8"
        style={{ background: '#fdf5e8', border: '1px solid #d4b896', boxShadow: '0 2px 12px rgba(45,26,10,0.1)' }}
      >
        <div className="grid grid-cols-1 gap-6">

          <div>
            <label style={labelStyle}>📚 Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="The Name of the Wind" required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>✍️ Author *</label>
            <input name="author" value={form.author} onChange={handleChange}
              placeholder="Patrick Rothfuss" required style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>🏷️ Genre</label>
              <input name="genre" value={form.genre} onChange={handleChange}
                placeholder="Fantasy" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>📄 Page Count</label>
              <input name="pageCount" type="number" value={form.pageCount} onChange={handleChange}
                placeholder="662" min="1" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>📌 Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
              <option value="want-to-read">🔖 Want to Read</option>
              <option value="reading">📖 Currently Reading</option>
              <option value="finished">✅ Finished</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>🌱 Start Date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>🍂 Finish Date</label>
              <input name="finishDate" type="date" value={form.finishDate} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label style={labelStyle}>⭐ Rating</label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, rating: prev.rating === String(n) ? '' : String(n) }))}
                  className="text-3xl transition-all hover:scale-125"
                  style={{ color: parseInt(form.rating) >= n ? '#c9721e' : '#d4b896', lineHeight: 1 }}
                >
                  ★
                </button>
              ))}
              {form.rating && (
                <button type="button" onClick={() => setForm(prev => ({ ...prev, rating: '' }))}
                  className="text-xs ml-2 italic" style={{ color: '#8b5e3c' }}>
                  clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>🖊️ Notes & Thoughts</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="What did you think? Any passages that stayed with you?"
              rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>🖼️ Cover Image URL (optional)</label>
            <input name="coverImage" value={form.coverImage} onChange={handleChange}
              placeholder="https://..." style={inputStyle} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
          <span className="text-sm" style={{ color: '#c9721e' }}>✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#d4b896' }} />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl font-semibold text-base transition-all hover:opacity-90"
            style={{ background: '#2d1a0a', color: '#f0c988' }}
          >
            🌿 Add to Shelf
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl font-medium text-base transition-all"
            style={{ background: '#f5e6cc', color: '#8b5e3c', border: '1px solid #d4b896' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
