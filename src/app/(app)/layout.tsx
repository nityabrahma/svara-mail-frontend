'use client'

import React from 'react';
import { MailNav } from '@/components/mail/mail-nav';
import { SidebarProvider, Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { ThemeProvider } from '@/components/theme/theme-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const isMailDetailView = parts.length === 2 && parts[0] !== 'login';

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider defaultOpen>
          <Sidebar>
              <SidebarContent>
                  <MailNav />
              </SidebarContent>
          </Sidebar>
          <div className="flex h-full flex-1">
              <div className={cn("w-full transition-all duration-300", isMailDetailView && pathname.includes('all') ? 'hidden md:block' : 'block' )}>
                  {children}
              </div>
          </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
