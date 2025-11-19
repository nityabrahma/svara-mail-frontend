import React from 'react';
import { cookies } from 'next/headers';
import { MailNav } from '@/components/mail/mail-nav';
import { UserNav } from '@/components/mail/user-nav';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  
  return (
    <SidebarProvider defaultOpen>
        <Sidebar>
            <SidebarContent>
                <MailNav />
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <div className="flex h-full flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
                    <SidebarTrigger className="md:hidden" />
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
