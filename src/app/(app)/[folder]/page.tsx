'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MailList } from '@/components/mail/mail-list'
import { useParams } from 'next/navigation'
import { useAppRouter } from '@/hooks/use-router'
import { getInboxEmails, Email } from '@/lib/emailApi' 
import { Skeleton } from '@/components/ui/skeleton'

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


export default function FolderPage() {
  const params = useParams()
  const router = useAppRouter()
  const folder = params.folder || 'inbox'
  const mailId = params.mailId

  const [mails, setMails] = React.useState<Email[]>([]) 
  const [loading, setLoading] = React.useState(true) 
  const [error, setError] = React.useState<string | null>(null) 

  React.useEffect(() => {
    async function fetchEmails() {
      setLoading(true);
      try {
        const inboxEmails = await getInboxEmails()
        setMails(inboxEmails)
      } catch (err) {
        setError('Failed to fetch emails')
      } finally {
        setLoading(false)
      }
    }
    fetchEmails()
  }, [])

  const filteredMails = React.useMemo(() => {
    if (folder === 'all') {
      return mails.filter(mail => !['trash', 'junk'].includes(mail.labels[0]))
    }
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder, mails])

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
        {filteredMails.length > 0 ? (
          <MailList items={filteredMails} onSelectMail={handleSelectMail} />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No mails in the <span className="font-semibold capitalize">{folder}</span> folder.
          </div>
        )}
      </div>
    </div>
  )
}
