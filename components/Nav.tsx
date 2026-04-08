'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Shelf' },
  { href: '/add', label: '+ Add Book' },
  { href: '/stats', label: 'Stats' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header style={{ background: '#5c3d2e' }} className="sticky top-0 z-10 shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">📚</span>
          <span
            className="text-xl font-bold tracking-wide"
            style={{ color: '#f5deb3', fontFamily: 'Georgia, serif' }}
          >
            Reading Log
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: active ? '#f5deb3' : 'transparent',
                  color: active ? '#5c3d2e' : '#f5deb3',
                  border: active ? 'none' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.target as HTMLElement).style.background = 'rgba(245,222,179,0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.target as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
