'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserCheck, ArrowRight } from 'lucide-react';

interface DemoUserButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  showArrow?: boolean;
  label?: string;
}

export function DemoUserButton({
  className,
  size = 'lg',
  variant = 'default',
  showArrow = true,
  label = 'Demo User',
}: DemoUserButtonProps) {
  const router = useRouter();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  const handleClick = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  return (
    <button
      onClick={handleClick}
      id="demo-user-button"
      className={cn(
        buttonVariants({ size, variant }),
        'cursor-pointer gap-2 font-semibold transition-all',
        className
      )}
    >
      <UserCheck className="size-5" />
      <span>{label}</span>
      {showArrow && <ArrowRight className="size-4" />}
    </button>
  );
}
