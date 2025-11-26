'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MailList } from '@/components/mail/mail-list'
import { useParams } from 'next/navigation'
import { useAppRouter } from '@/hooks/use-router'
import { getInboxEmails, Email } from '@/lib/emailApi' 

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
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="h-full w-full flex">
       <div className="w-full h-full overflow-hidden">
        <MailList items={filteredMails} onSelectMail={handleSelectMail} />
      </div>
    </div>
  )
}
