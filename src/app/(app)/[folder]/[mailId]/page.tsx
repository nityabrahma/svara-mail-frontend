'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MailDisplay } from '@/components/mail/mail-display'
import { useParams } from 'next/navigation'
import { getInboxById, Email } from '@/lib/emailApi'

export default function MailPage() {
  const params = useParams()
  const { mailId } = params

  const [selectedMail, setSelectedMail] = React.useState<Email | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);


  React.useEffect(() => {
    if (mailId) {
      const fetchMail = async () => {
        setLoading(true);
        setError(null);
        try {
          const mail = await getInboxById(mailId as string);
          setSelectedMail(mail);
        } catch (err) {
          setError('Failed to fetch email');
        } finally {
          setLoading(false);
        }
      };
      fetchMail();
    }
  }, [mailId]);


  if (loading) {
    return <div className='p-4'>Loading email...</div>;
  }

  if (error) {
    return <div className='p-4'>{error}</div>;
  }

  if (!selectedMail) {
    return <div className='p-4'>Email not found.</div>;
  }
  
  return (
    <motion.div
        key={mailId as string}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full h-full bg-background"
    >
        <MailDisplay mail={selectedMail} />
    </motion.div>
  )
}
