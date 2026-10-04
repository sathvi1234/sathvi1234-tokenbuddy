'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  useEffect(() => {
    loginAsDemo();
    router.replace('/dashboard');
  }, [loginAsDemo, router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="text-center space-y-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        <p className="text-muted-foreground">Redirecting to TokenBuddy Dashboard as Demo User...</p>
      </div>
    </div>
  );
}
