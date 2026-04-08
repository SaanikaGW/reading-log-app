'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/lib/BookContext';
import { BookStatus } from '@/lib/types';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #e8d5b7',
  background: '#fffaf4',
  color: '#3b2e1e',
  fontFamily: 'Georgia, serif',
  fontSize: '15px',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#7a5c3e',
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
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
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}>
          Book added!
        </h2>
        <p style={{ color: '#a07850' }}>Heading back to your shelf...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: '#3b2e1e', fontFamily: 'Georgia, serif' }}
        >
          Add a Book
        </h1>
        <p style={{ color: '#a07850' }}>Log a new book to your shelf</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-8 shadow-sm"
        style={{ background: '#fff8f0', border: '1px solid #e8d5b7' }}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="The Great Gatsby"
              required
              style={inputStyle}
            />
          </div>

          {/* Author */}
          <div>
            <label style={labelStyle}>Author *</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="F. Scott Fitzgerald"
              required
              style={inputStyle}
            />
          </div>

          {/* Genre + Page Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Genre</label>
              <input
                name="genre"
                value={form.genre}
                onChange={handleChange}
                placeholder="Literary Fiction"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Page Count</label>
              <input
                name="pageCount"
                type="number"
                value={form.pageCount}
                onChange={handleChange}
                placeholder="320"
                min="1"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Finish Date</label>
              <input
                name="finishDate"
                type="date"
                value={form.finishDate}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label style={labelStyle}>Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, rating: prev.rating === String(n) ? '' : String(n) }))}
                  className="text-2xl transition-transform hover:scale-110"
                  style={{ color: parseInt(form.rating) >= n ? '#d97706' : '#e8d5b7' }}
                >
                  ★
                </button>
              ))}
              {form.rating && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, rating: '' }))}
                  className="text-sm ml-2"
                  style={{ color: '#a07850' }}
                >
                  clear
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes / Review</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="What did you think? Any favorite quotes?"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label style={labelStyle}>Cover Image URL (optional)</label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className="flex-1 py-3 rounded-full font-semibold text-base transition-all hover:opacity-90"
            style={{ background: '#5c3d2e', color: '#f5deb3' }}
          >
            Add to Shelf
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full font-medium text-base transition-all"
            style={{ background: '#f0e0cc', color: '#7a5c3e', border: '1px solid #e8d5b7' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
