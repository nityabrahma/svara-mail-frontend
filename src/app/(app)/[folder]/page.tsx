'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MailList } from '@/components/mail/mail-list'
import { mails } from '@/lib/data'
import { useParams } from 'next/navigation'
import { MailDisplay } from '@/components/mail/mail-display'
import { useAppRouter } from '@/hooks/use-router'

export default function FolderPage() {
  const params = useParams()
  const router = useAppRouter()
  const folder = params.folder || 'inbox'
  const mailId = params.mailId

  const filteredMails = React.useMemo(() => {
    if (folder === 'all') {
      return mails.filter(mail => !['trash', 'junk'].includes(mail.labels[0]))
    }
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder])

  const handleSelectMail = (id: string) => {
    router.push(`/${folder}/${id}`)
  }

  const selectedMail = React.useMemo(() => {
    if (!mailId) return null;
    return mails.find((mail) => mail.id === mailId) ?? null
  }, [mailId])


  return (
    <div className="h-full w-full flex">
       <div className="w-full h-full overflow-hidden">
        <MailList items={filteredMails} onSelectMail={handleSelectMail} />
      </div>
    </div>
  )
}
