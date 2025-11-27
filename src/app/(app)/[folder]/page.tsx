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
  const { setMails: setToolbarMails } = useMailToolbar();
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
      setToolbarMails(prev => isInitialLoad ? newMails : [...prev, ...newMails]);

      setHasNextPage(response.pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasNextPage, setToolbarMails]);

  React.useEffect(() => {
    loadEmails(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const loadMoreEmails = React.useCallback(() => {
    if (hasNextPage && !loadingMore) {
        loadEmails(page + 1);
    }
  }, [hasNextPage, loadingMore, page, loadEmails]);

  React.useEffect(() => {
    if (socket) {
      socket.on('inbox_updated', () => {
        console.log('Inbox updated via socket, reloading...');
        loadEmails(1, true);
      });

      return () => {
        socket.off('inbox_updated');
      };
    }
  }, [socket, loadEmails]);

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
