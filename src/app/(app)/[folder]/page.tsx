'use client'

import * as React from 'react'
import { redirect } from 'next/navigation'
import { MailList } from '@/components/mail/mail-list'
import { MailDisplay } from '@/components/mail/mail-display'
import { mails } from '@/lib/data'
import { useParams } from 'next/navigation'

export default function FolderPage() {
  const params = useParams()
  const folder = params.folder || 'inbox'

  React.useEffect(() => {
    if (folder === 'inbox') {
        redirect('/all')
    }
  }, [folder])


  const filteredMails = React.useMemo(() => {
    if (folder === 'all') {
        return mails.filter(mail => !['trash', 'junk'].includes(mail.labels[0]))
    }
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder])

  return (
    <div className="h-full w-full overflow-hidden grid grid-cols-1 md:grid-cols-[440px_1fr]">
        <div className="h-full border-r">
            <MailList items={filteredMails} selectedMailId={null} />
        </div>
        <div className="h-full hidden md:block">
            <MailDisplay mail={null} />
        </div>
    </div>
  )
}
