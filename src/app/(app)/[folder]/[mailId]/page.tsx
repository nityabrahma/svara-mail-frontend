'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MailDisplay } from '@/components/mail/mail-display'
import { mails } from '@/lib/data'
import { useParams } from 'next/navigation'

export default function MailPage() {
  const params = useParams()
  const { mailId } = params

  const selectedMail = React.useMemo(() => {
    return mails.find((mail) => mail.id === mailId) ?? null
  }, [mailId])

  return (
    <AnimatePresence>
        <motion.div
            key={mailId as string}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <MailDisplay mail={selectedMail} />
        </motion.div>
    </AnimatePresence>
  )
}
