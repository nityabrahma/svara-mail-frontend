'use client'

import * as React from 'react'

import { MailList } from '@/components/mail/mail-list'
import { MailDisplay } from '@/components/mail/mail-display'
import { mails, type Mail } from '@/lib/data'
import { useParams, useRouter } from 'next/navigation'

export default function InboxMailPage() {
  const params = useParams()
  const router = useRouter()
  const { folder, mailId } = params

  const filteredMails = React.useMemo(() => {
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder])

  const selectedMail = React.useMemo(() => {
    return mails.find((mail) => mail.id === mailId) ?? null
  }, [mailId])

  const handleSelectMail = (id: string) => {
    router.push(`/inbox/${folder}/${id}`)
  }

  return (
    <div className="h-full w-full overflow-hidden grid md:grid-cols-[440px_1fr]">
        <div className="h-full border-r">
            <MailList items={filteredMails} onSelectMail={handleSelectMail} selectedMailId={mailId as string} />
        </div>
        <div className="h-full">
            <MailDisplay mail={selectedMail} />
        </div>
    </div>
  )
}
