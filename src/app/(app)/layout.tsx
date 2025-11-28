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
import { useLoading } from '@/hooks/use-loading';
import { AnimatePresence, motion } from 'framer-motion';
import { MailToolbar } from '@/components/mail/mail-toolbar';
import { MailActionsContext, MailToolbarContext } from '@/hooks/use-mail-actions';
import { useToast } from '@/hooks/use-toast';
import { Email, markEmailsAsSeen } from '@/lib/emailApi';


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

function GlobalLoader() {
    const { loading } = useLoading();

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 w-full h-1 z-50"
                >
                    <div className="h-full bg-primary animate-pulse" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}


export function MailActionsProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [selectedMails, setSelectedMails] = React.useState<Email[]>([]);
    const [allMails, setAllMails] = React.useState<Email[]>([]);

    const handleSelect = (mail: Email) => {
        setSelectedMails(prevSelected => {
            if (prevSelected.some(m => m.id === mail.id)) {
                return prevSelected.filter(m => m.id !== mail.id);
            } else {
                return [...prevSelected, mail];
            }
        });
    };
    
    const handleSelectAll = (mails: Email[]) => {
        if (selectedMails.length === mails.length) {
          setSelectedMails([]);
        } else {
          setSelectedMails(mails);
        }
      };

    const handleClearSelection = () => {
        setSelectedMails([]);
    };
    
    const handleReply = (mail: Email) => {
        console.log('Replying to:', mail.id);
        toast({ title: "Reply", description: `Replying to "${mail.subject}".` });
        setSelectedMails([]);
    };

    const handleMoveTo = (mails: Email[] | Email, folder: 'inbox' | 'archive' | 'trash') => {
        const mailArray = Array.isArray(mails) ? mails : [mails];
        console.log(`Moving ${mailArray.map(m => m.id).join(', ')} to ${folder}`);
        toast({ title: "Moved", description: `${mailArray.length} email(s) moved to ${folder}.` });
        setSelectedMails([]);
    };

    const handleDelete = (mails: Email[]) => {
        console.log('Deleting:', mails.map(m => m.id).join(', '));
        toast({ title: "Deleted", description: `${mails.length} email(s) permanently deleted.` });
        setSelectedMails([]);
    };
    
    const handleMarkAsRead = async (mails: Email[], read: boolean) => {
        try {
            const emailIds = mails.map(m => m.id);
            await markEmailsAsSeen(emailIds);
            
            // Update local state
            setAllMails(prev => prev.map(mail => 
                emailIds.includes(mail.id) ? { ...mail, read } : mail
            ));
            
            console.log(`Marking ${emailIds.join(', ')} as ${read ? 'read' : 'unread'}`);
            toast({ title: "Updated", description: `${mails.length} email(s) marked as ${read ? 'read' : 'unread'}.` });
            setSelectedMails([]);
        } catch (error) {
            console.error('Error marking emails as read:', error);
            toast({ 
                title: "Error", 
                description: "Failed to update email status.",
                variant: "destructive"
            });
        }
    };
    
    const mailActionsValue = React.useMemo(() => ({
        selectedMails,
        handleSelect,
        handleSelectAll,
        handleClearSelection,
        handleReply,
        handleMoveTo,
        handleDelete,
        handleMarkAsRead,
    }), [selectedMails]);

    const mailToolbarValue = React.useMemo(() => ({
        mails: allMails,
        setMails: setAllMails,
    }), [allMails]);

    return (
        <MailActionsContext.Provider value={mailActionsValue}>
            <MailToolbarContext.Provider value={mailToolbarValue}>
                {children}
            </MailToolbarContext.Provider>
        </MailActionsContext.Provider>
    );
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isComposeOpen, setComposeOpen] = React.useState(false);

  return (
    <MailActionsProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full flex-col">
            <GlobalLoader />
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar>
                    <SidebarContent>
                        <MailNav onComposeClick={() => setComposeOpen(true)} />
                    </SidebarContent>
                </Sidebar>
                <main className="flex-1 overflow-auto flex flex-col">
                    <MailToolbar />
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
    </MailActionsProvider>
  );
}
