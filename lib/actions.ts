'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getSupabase } from './supabase';
import { Book, BookStatus } from './types';

function toBook(row: Record<string, unknown>): Book {
  return {
    id: row.id as string,
    title: row.title as string,
    author: row.author as string,
    genre: (row.genre as string) || '',
    pageCount: (row.page_count as number) || 0,
    startDate: (row.start_date as string) || undefined,
    finishDate: (row.finish_date as string) || undefined,
    status: row.status as BookStatus,
    rating: (row.rating as number) || undefined,
    notes: (row.notes as string) || undefined,
    coverImage: (row.cover_image as string) || undefined,
    ol_key: (row.ol_key as string) || undefined,
  };
}

export async function getBooks(): Promise<Book[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const { data, error } = await getSupabase()
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(toBook);
}

export async function getBook(id: string): Promise<Book | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const { data, error } = await getSupabase()
    .from('books')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return toBook(data);
}

export async function addBook(bookData: Omit<Book, 'id'>): Promise<Book> {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await getSupabase()
    .from('books')
    .insert({
      user_id: userId,
      title: bookData.title,
      author: bookData.author,
      genre: bookData.genre || null,
      page_count: bookData.pageCount || null,
      start_date: bookData.startDate || null,
      finish_date: bookData.finishDate || null,
      status: bookData.status,
      rating: bookData.rating || null,
      notes: bookData.notes || null,
      cover_image: bookData.coverImage || null,
      ol_key: bookData.ol_key || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return toBook(data);
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const dbUpdates: Record<string, unknown> = {};
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
  if (updates.finishDate !== undefined) dbUpdates.finish_date = updates.finishDate;

  const { error } = await getSupabase()
    .from('books')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath(`/book/${id}`);
}

export async function deleteBook(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await getSupabase()
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/');
}
