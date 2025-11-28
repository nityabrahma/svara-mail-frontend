'use client'

import * as React from 'react'
import { MailList } from '@/components/mail/mail-list'
import { useParams } from 'next/navigation'
import { useAppRouter } from '@/hooks/use-router'
import { getInboxEmails, Email } from '@/lib/emailApi' 
import { Skeleton } from '@/components/ui/skeleton'
import { useMailActions, useMailToolbar } from '@/hooks/use-mail-actions'
import { useSocket } from '@/hooks/use-socket'

function MailListSkeleton() {
  return (
    <div className="flex flex-col gap-0 border-t">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="flex flex-col items-start gap-2 p-4 text-left text-sm border-b">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      ))}
    </div>
  )
}

export default function FolderPage() {
  const params = useParams()
  const router = useAppRouter()
  const folder = params.folder || 'inbox'
  const mailId = params.mailId

  const [mails, setMails] = React.useState<Email[]>([]) 
  const [page, setPage] = React.useState(0);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [loading, setLoading] = React.useState(true) 
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null)
  
  const { selectedMails, handleSelect } = useMailActions();
  const { mails: toolbarMails, setMails: setToolbarMails, setInboxCount } = useMailToolbar();
  const { socket } = useSocket();

  const loadEmails = React.useCallback(async (pageNum: number, isInitialLoad = false) => {
    if (!hasNextPage && !isInitialLoad) return;

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await getInboxEmails(pageNum, 20);
      
      const newMails = response.data;

      setMails(prev => isInitialLoad ? newMails : [...prev, ...newMails]);

      setHasNextPage(response.pagination.hasNextPage);
      setPage(pageNum);
      
      // Update inbox count from pagination
      if (folder === 'inbox' && setInboxCount) {
        setInboxCount(response.pagination.totalItems);
      }
    } catch (err) {
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasNextPage]);

  React.useEffect(() => {
    loadEmails(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync mails to toolbar
  React.useEffect(() => {
    if (setToolbarMails) {
      setToolbarMails(mails);
    }
  }, [mails, setToolbarMails]);

  // Sync updates from toolbar back to local state (for mark as read, etc.)
  React.useEffect(() => {
    if (toolbarMails && toolbarMails.length > 0) {
      setMails(prev => {
        // Only update if there are actual changes (to avoid infinite loops)
        const hasChanges = prev.some(mail => {
          const toolbarMail = toolbarMails.find(tm => tm.id === mail.id);
          return toolbarMail && toolbarMail.read !== mail.read;
        });
        
        if (hasChanges) {
          return prev.map(mail => {
            const toolbarMail = toolbarMails.find(tm => tm.id === mail.id);
            return toolbarMail || mail;
          });
        }
        
        return prev;
      });
    }
  }, [toolbarMails]);
  
  const loadMoreEmails = React.useCallback(() => {
    if (hasNextPage && !loadingMore) {
        loadEmails(page + 1);
    }
  }, [hasNextPage, loadingMore, page, loadEmails]);

  // Socket event listeners for real-time updates
  React.useEffect(() => {
    if (!socket) return;

    const handleInboxUpdated = (data: any) => {
      // If this inbox_updated event was triggered by a new_email (has newEmailId),
      // skip the reload since new_email handler already added the email
      if (data?.newEmailId) {
        console.log('📬 Inbox updated via new email, skipping reload');
        return;
      }
      console.log('📬 Inbox updated via socket, reloading...');
      loadEmails(1, true);
    };

    const handleNewEmail = (data: any) => {
      console.log('📨 New email received:', data);
      // Add the new email to the beginning of the list
      if (data.email) {
        const newMail: Email = {
          id: String(data.email.id),
          name: (data.email.from_address || '').split('@')[0] || 'Unknown',
          email: data.email.from_address || '',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.email.from_address}`,
          subject: data.email.subject || '(No subject)',
          body: data.email.body || '',
          text: data.email.html_body || data.email.body || '',
          date: data.email.created_at || new Date().toISOString(),
          read: false,
          labels: ['inbox'],
          attachments: data.email.attachments || [],
        };
        setMails(prev => [newMail, ...prev]);
        
        // Update inbox count when new email arrives
        if (folder === 'inbox' && setInboxCount) {
          setInboxCount((prev: number) => prev + 1);
        }
      }
    };

    const handleDeletedEmails = (data: any) => {
      console.log('🗑️ Emails deleted via socket:', data);
      if (data.emailIds && Array.isArray(data.emailIds)) {
        const deletedIds = data.emailIds.map((id: any) => String(id));
        setMails(prev => prev.filter(mail => !deletedIds.includes(mail.id)));
        
        // Update inbox count when emails are deleted
        if (folder === 'inbox' && setInboxCount) {
          setInboxCount((prev: number) => Math.max(0, prev - deletedIds.length));
        }
      }
    };

    const handleEmailRestored = (data: any) => {
      console.log('📧 Email restored via socket:', data);
      // Reload emails to show the restored email
      loadEmails(1, true);
    };

    // Register all socket event listeners
    socket.on('inbox_updated', handleInboxUpdated);
    socket.on('new_email', handleNewEmail);
    socket.on('deleted_emails', handleDeletedEmails);
    socket.on('email_restored', handleEmailRestored);

    return () => {
      socket.off('inbox_updated', handleInboxUpdated);
      socket.off('new_email', handleNewEmail);
      socket.off('deleted_emails', handleDeletedEmails);
      socket.off('email_restored', handleEmailRestored);
    };
  }, [socket, loadEmails, setToolbarMails, folder, setInboxCount]);

  const filteredMails = React.useMemo(() => {
    return mails.filter(mail => {
      const labels = mail.labels || [];
      if (folder === 'inbox') {
        return labels.includes('inbox') && !labels.includes('trash') && !labels.includes('junk');
      }
      if (folder === 'all') {
        return !labels.includes('trash') && !labels.includes('junk');
      }
      return labels.includes(folder as string);
    });
  }, [folder, mails]);

  const handleSelectMail = (id: string) => {
    router.push(`/${folder}/${id}`)
  }

  if (loading) {
    return <MailListSkeleton />
  }
  
  if (error && mails.length === 0) {
    return <div className="p-8 text-center">{error}</div>
  }

  return (
    <div className="h-full w-full flex">
       <div className="w-full h-full overflow-hidden">
        {filteredMails.length > 0 || loadingMore ? (
          <MailList 
            items={filteredMails} 
            onSelectMail={handleSelectMail}
            selectedMails={selectedMails}
            onSelect={handleSelect}
            selectedMailId={mailId as string}
            loadMore={loadMoreEmails}
            hasNextPage={hasNextPage}
            loadingMore={loadingMore}
          />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No mails in the <span className="font-semibold capitalize">{folder}</span> folder.
          </div>
        )}
      </div>
    </div>
  )
}
