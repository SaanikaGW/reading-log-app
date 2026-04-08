'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from './types';

const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Secret History',
    author: 'Donna Tartt',
    genre: 'Literary Fiction',
    pageCount: 559,
    startDate: '2024-01-10',
    finishDate: '2024-02-03',
    status: 'finished',
    rating: 5,
    notes: 'Absolutely captivating. The unreliable narrator kept me hooked the entire time.',
    coverImage: '',
  },
  {
    id: '2',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    genre: 'Fantasy',
    pageCount: 272,
    startDate: '2024-03-01',
    status: 'reading',
    rating: 4,
    notes: 'Surreal and beautiful. The world-building is unlike anything I\'ve read.',
    coverImage: '',
  },
  {
    id: '3',
    title: 'Pachinko',
    author: 'Min Jin Lee',
    genre: 'Historical Fiction',
    pageCount: 496,
    status: 'want-to-read',
    coverImage: '',
  },
  {
    id: '4',
    title: 'Mexican Gothic',
    author: 'Silvia Moreno-Garcia',
    genre: 'Gothic Horror',
    pageCount: 320,
    startDate: '2023-10-15',
    finishDate: '2023-11-01',
    status: 'finished',
    rating: 4,
    notes: 'Atmospheric and unsettling. Perfect October read.',
    coverImage: '',
  },
];

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getBook: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const book: Book = {
      ...bookData,
      id: Date.now().toString(),
    };
    setBooks(prev => [book, ...prev]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const getBook = (id: string) => books.find(b => b.id === id);

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook, getBook }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks must be used within BookProvider');
  return ctx;
}
