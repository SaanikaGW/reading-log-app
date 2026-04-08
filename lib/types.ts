export type BookStatus = 'reading' | 'finished' | 'want-to-read';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pageCount: number;
  startDate?: string;
  finishDate?: string;
  status: BookStatus;
  rating?: number;
  notes?: string;
  coverImage?: string;
}
