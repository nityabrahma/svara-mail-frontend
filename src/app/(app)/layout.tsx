'use client'

import React from 'react';
import { MailNav } from '@/components/mail/mail-nav';
import { UserNav } from '@/components/mail/user-nav';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const mailId = params.mailId;

  return (
    <SidebarProvider defaultOpen>
        <AnimatePresence>
          {!mailId && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                  <Sidebar>
                      <SidebarContent>
                          <MailNav />
                      </SidebarContent>
                  </Sidebar>
              </motion.div>
          )}
        </AnimatePresence>
        <SidebarInset className={cn(mailId && 'md:m-0 md:rounded-none')}>
            <div className="flex h-full flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
                    <SidebarTrigger className={cn("md:hidden", mailId && "hidden")} />
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search mail..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <UserNav />
                </header>
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
