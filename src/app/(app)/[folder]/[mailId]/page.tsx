'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MailDisplay } from '@/components/mail/mail-display'
import { mails } from '@/lib/data'
import { useParams } from 'next/navigation'
import { MailList } from '@/components/mail/mail-list'
import { cn } from '@/lib/utils'

export default function MailPage() {
  const params = useParams()
  const { mailId, folder } = params

  const selectedMail = React.useMemo(() => {
    return mails.find((mail) => mail.id === mailId) ?? null
  }, [mailId])
  
  const filteredMails = React.useMemo(() => {
    if (folder === 'all') {
        return mails.filter(mail => !['trash', 'junk'].includes(mail.labels[0]))
    }
    return mails.filter((mail) => mail.labels.includes(folder as string))
  }, [folder])

  return (
    <div className="h-full w-full overflow-hidden grid grid-cols-1 md:grid-cols-[440px_1fr]">
        <div className={cn("h-full border-r", mailId && "hidden md:block")}>
            <MailList items={filteredMails} selectedMailId={mailId as string} />
        </div>
        <AnimatePresence>
            {selectedMail && (
                <motion.div
                    key={mailId as string}
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={cn(
                        "h-full",
                        mailId && "absolute md:relative w-full h-full bg-background"
                    )}
                >
                    <MailDisplay mail={selectedMail} />
                </motion.div>
            )}
        </AnimatePresence>
        {!selectedMail && (
             <div className="h-full hidden md:block">
                <MailDisplay mail={null} />
            </div>
        )}
    </div>
  )
}
