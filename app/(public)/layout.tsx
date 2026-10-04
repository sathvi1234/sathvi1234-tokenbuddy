'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';
import { useAuthStore } from '@/lib/store/auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { useThemeStore as getTheme } from '@/lib/store/theme-store';
import { Moon, Sun, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const isDark = getTheme((state) => state.isDark);
  const toggleTheme = getTheme((state) => state.toggleTheme);
  const initTheme = getTheme((state) => state.initTheme);
  const { loginAsDemo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const handleDemoUser = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-xs font-bold text-white">TB</span>
            </div>
            <span className="text-lg font-bold">TokenBuddy</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent cursor-pointer"
              title="Toggle theme"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDemoUser}
                className={cn(buttonVariants({ variant: 'default' }), 'gap-2 cursor-pointer shadow-sm')}
                id="header-demo-user-btn"
              >
                <UserCheck className="size-4" />
                Demo User
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-8">
        <div className="container max-w-7xl text-center text-sm text-muted-foreground">
          <p>&copy; 2026 TokenBuddy. Built for Hacktoberfest Weekend Challenge &quot;Build for a Friend&quot;.</p>
        </div>
      </footer>
    </div>
  );
}
