'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
}

export default function Navbar({ isAuthenticated = false, username }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-black bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-black">
            LeetTrack
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/todo"
                  className={`px-3 py-1 border-b-2 transition-colors ${
                    isActive('/dashboard/todo')
                      ? 'border-black text-black font-medium'
                      : 'border-transparent text-black hover:text-black'
                  }`}
                >
                  Today
                </Link>
                <Link
                  href="/dashboard/stats"
                  className={`px-3 py-1 border-b-2 transition-colors ${
                    isActive('/dashboard/stats')
                      ? 'border-black text-black font-medium'
                      : 'border-transparent text-black hover:text-black'
                  }`}
                >
                  Stats
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-black">
                    {username || 'User'}
                  </span>
                  <button className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}