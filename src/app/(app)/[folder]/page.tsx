'use client'

import * as React from 'react'

import { MailList } from '@/components/mail/mail-list'
import { MailDisplay } from '@/components/mail/mail-display'
import { mails } from '@/lib/data'
import { useParams, useRouter } from 'next/navigation'

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()

  const folder = params.folder || 'inbox'

  const filteredMails = React.useMemo(() => {
    if (folder === 'all') {
        return mails.filter(mail => !['trash', 'junk'].includes(mail.labels[0]))
    }
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder])

  const handleSelectMail = (id: string) => {
    router.push(`/${folder}/${id}`)
  }

  return (
    <div className="h-full w-full overflow-hidden grid md:grid-cols-[440px_1fr]">
        <div className="h-full border-r">
            <MailList items={filteredMails} onSelectMail={handleSelectMail} selectedMailId={null} />
        </div>
        <div className="h-full">
            <MailDisplay mail={null} />
        </div>
    </div>
  )
}
