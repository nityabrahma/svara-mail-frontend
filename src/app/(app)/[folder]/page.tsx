'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
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
      {Array.from({ length: 10 }).map((_, i) => (
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

const mapAndSanitizeEmails = (emails: (any | null | undefined)[]): Email[] => {
  if (!Array.isArray(emails)) return [];
  return emails.filter((e): e is any => !!e).map(item => {
    const sender = item.from_address || item.email || "";

    const labels: string[] = Array.isArray(item.labels) ? [...item.labels] : [];
    if (item.is_archived && !labels.includes("archive")) labels.push("archive");
    if (item.is_trashed && !labels.includes("trash")) labels.push("trash");
    if (item.folder?.toLowerCase() === 'sent' && !labels.includes('sent')) labels.push('sent');
    if (item.folder?.toLowerCase() === 'drafts' && !labels.includes('drafts')) labels.push('drafts');
    if (item.folder?.toLowerCase() === 'junk' && !labels.includes('junk')) labels.push('junk');
    
    // If it has no labels and isn't explicitly in another folder, it's in the inbox.
    if (labels.length === 0 && !item.folder) {
        labels.push('inbox');
    }

    return {
      id: String(item.id),
      name: sender.split("@")[0] || "Unknown Sender",
      email: sender,
      avatar: item.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${sender}`,
      subject: item.subject || "(No subject)",
      body: item.body || "",
      text: item.html_body || item.body || "",
      date: item.created_at || item.date || new Date().toISOString(),
      read: item.is_seen ?? item.read ?? false,
      labels: labels,
      attachments: item.attachments || [],
    };
  });
};

export default function FolderPage() {
  const params = useParams()
  const router = useAppRouter()
  const folder = params.folder || 'inbox'
  const mailId = params.mailId

  const [mails, setMails] = React.useState<Email[]>([]) 
  const [loading, setLoading] = React.useState(true) 
  const [error, setError] = React.useState<string | null>(null)
  
  const { selectedMails, handleSelect } = useMailActions();
  const { setMails: setToolbarMails } = useMailToolbar();
  const { socket } = useSocket();

  React.useEffect(() => {
    async function fetchEmails() {
      setLoading(true);
      try {
        const inboxEmails = await getInboxEmails();
        const sanitized = mapAndSanitizeEmails(inboxEmails);
        setMails(sanitized)
        setToolbarMails(sanitized);
      } catch (err) {
        setError('Failed to fetch emails')
      } finally {
        setLoading(false)
      }
    }
    fetchEmails()
  }, [setToolbarMails])

  React.useEffect(() => {
    if (socket) {
      socket.on('inbox_updated', (data: { inbox: any[] }) => {
        if (data.inbox) {
          const sanitized = mapAndSanitizeEmails(data.inbox);
          setMails(sanitized);
          setToolbarMails(sanitized);
        }
      });

      return () => {
        socket.off('inbox_updated');
      };
    }
  }, [socket, setMails, setToolbarMails]);

  const filteredMails = React.useMemo(() => {
    return mails.filter(mail => {
      const labels = mail.labels || [];
      if (folder === 'inbox') {
        return labels.includes('inbox') && !labels.includes('trash') && !labels.includes('junk');
      }
      if (folder === 'all') {
        // Assuming 'all' means everything not in trash or junk.
        return !labels.includes('trash') && !labels.includes('junk');
      }
      return labels.includes(folder as string);
    });
  }, [folder, mails]);

  const handleSelectMail = (id: string) => {
    router.push(`/${folder}/${id}`)
  }

  const selectedMail = React.useMemo(() => {
    if (!mailId) return null;
    return mails.find((mail) => mail.id === mailId) ?? null
  }, [mailId, mails])

  if (loading) {
    return <MailListSkeleton />
  }

  if (error) {
    return <div className="p-8 text-center">{error}</div>
  }

  return (
    <div className="h-full w-full flex">
       <div className="w-full h-full overflow-hidden">
        {mails.length > 0 ? (
          <MailList 
            items={filteredMails} 
            onSelectMail={handleSelectMail}
            selectedMails={selectedMails}
            onSelect={handleSelect}
            selectedMailId={mailId as string}
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
