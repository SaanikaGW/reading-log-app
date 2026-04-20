import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
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
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="min-h-full flex flex-col" style={{ background: '#f5e6cc', color: '#2d1a0a' }}>
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="text-center py-8 border-t" style={{ borderColor: '#d4b896', background: '#ede0c8' }}>
            <p className="text-sm italic" style={{ color: '#8b5e3c' }}>
              🕯️ &nbsp;a quiet place for your reading life&nbsp; 🕯️
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
