import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isCollapsed?: boolean;
};

export function Logo({ size = 'md', className, isCollapsed }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Mail className={cn(sizeClasses[size], 'text-primary')} />
      {!isCollapsed && (
        <h1
          className={cn(
            'font-headline font-bold text-primary',
            textSizeClasses[size]
          )}
        >
          ReactMail
        </h1>
      )}
    </div>
  );
}
