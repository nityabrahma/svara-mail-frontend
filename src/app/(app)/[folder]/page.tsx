'use client'

import * as React from 'react'
import { MailList } from '@/components/mail/mail-list'
import { mails } from '@/lib/data'
import { useParams } from 'next/navigation'

export default function FolderPage() {
  const params = useParams()
  const folder = params.folder || 'inbox'

  const filteredMails = React.useMemo(() => {
    if (folder === 'all') {
        return mails.filter(mail => !['trash', 'junk'].includes(mail.labels[0]))
    }
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder])

  return (
    <div className="h-full w-full overflow-hidden">
        <MailList items={filteredMails} />
    </div>
  )
}
