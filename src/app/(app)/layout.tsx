'use client'

import React from 'react';
import { MailNav } from '@/components/mail/mail-nav';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ComposeDialog } from '@/components/mail/compose-dialog';
import { MotionButton } from '@/components/ui/button';
import { Edit, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/mail/user-nav';

function AppHeader() {
    return (
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-2">
                <Logo />
                <SidebarTrigger className="flex" />
            </div>

            <div className="ml-auto flex flex-1 items-center justify-end gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search mail..."
                        className="w-full appearance-none bg-secondary/90 py-3 pl-10 shadow-none"
                    />
                </div>
                <UserNav />
            </div>
        </header>
    )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isComposeOpen, setComposeOpen] = React.useState(false);

  return (
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full flex-col">
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar>
                    <SidebarContent>
                        <MailNav onComposeClick={() => setComposeOpen(true)} />
                    </SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
        <ComposeDialog open={isComposeOpen} onOpenChange={setComposeOpen} />
        <MotionButton
            onClick={() => setComposeOpen(true)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-10"
        >
            <Edit className="h-6 w-6" />
            <span className="sr-only">Compose</span>
        </MotionButton>
      </SidebarProvider>
  );
}
