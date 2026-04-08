import type { Metadata } from 'next';
import './globals.css';
import { BookProvider } from '@/lib/BookContext';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Reading Log',
  description: 'Your personal reading journal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#fdf6ee', color: '#3b2e1e' }}>
        <BookProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="text-center py-6 text-sm" style={{ color: '#a07850' }}>
            your reading journey ✦
          </footer>
        </BookProvider>
      </body>
    </html>
  );
}
