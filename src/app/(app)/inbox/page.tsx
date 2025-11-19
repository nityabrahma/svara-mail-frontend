'use client'

import * as React from 'react'

import { MailList } from '@/components/mail/mail-list'
import { MailDisplay } from '@/components/mail/mail-display'
import { mails, type Mail } from '@/lib/data'
import { useSearchParams } from 'next/navigation'

export default function InboxPage() {
  const searchParams = useSearchParams()
  const folder = searchParams.get('folder') || 'inbox'
  const [selectedMailId, setSelectedMailId] = React.useState<string | null>(null)

  const filteredMails = React.useMemo(() => {
    return mails.filter((mail) => mail.labels.includes(folder))
  }, [folder])

  const selectedMail = React.useMemo(() => {
    return mails.find((mail) => mail.id === selectedMailId) ?? null
  }, [selectedMailId])

  const handleSelectMail = (id: string) => {
    setSelectedMailId(id)
  }

  return (
    <div className="h-full w-full overflow-hidden grid md:grid-cols-[440px_1fr]">
        <div className="h-full border-r">
            <MailList items={filteredMails} onSelectMail={handleSelectMail} selectedMailId={selectedMailId} />
        </div>
        <div className="h-full">
            <MailDisplay mail={selectedMail} />
        </div>
    </div>
  )
}
