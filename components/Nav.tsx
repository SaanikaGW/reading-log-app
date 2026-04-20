'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';

export default function Nav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const links = isSignedIn
    ? [
        { href: '/', label: 'My Shelf' },
        { href: '/search', label: '🔍 Search Books' },
        { href: '/add', label: '+ Log a Book' },
        { href: '/stats', label: 'Reading Stats' },
      ]
    : [{ href: '/', label: 'Home' }];

  return (
    <header style={{ background: '#1e0e05', borderBottom: '3px solid #4a2c17' }}>
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl">📚</span>
            <div>
              <div
                className="text-xl font-bold tracking-wide leading-none"
                style={{ color: '#f0c988', fontFamily: 'Georgia, serif' }}
              >
                Reading Log
              </div>
              <div className="text-xs italic mt-0.5" style={{ color: '#8b5e3c' }}>
                your personal reading journal
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {links.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="px-4 py-2 text-sm transition-all"
                    style={{
                      color: active ? '#f0c988' : '#c4a882',
                      borderBottom: active ? '2px solid #c9721e' : '2px solid transparent',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-3 flex items-center gap-2">
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button
                      className="px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{ color: '#c4a882', border: '1px solid #4a2c17', fontFamily: 'Georgia, serif' }}
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      className="px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-90"
                      style={{ background: '#c9721e', color: '#fdf5e8', fontFamily: 'Georgia, serif' }}
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 border-t" style={{ borderColor: '#3d2010' }} />
          <span className="text-xs" style={{ color: '#5a3520' }}>✦ ✦ ✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#3d2010' }} />
        </div>
      </div>
    </header>
  );
}
