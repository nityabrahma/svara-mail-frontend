'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, MailOpen, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMailActions, useMailToolbar } from '@/hooks/use-mail-actions'
import { deleteEmails } from '@/lib/emailApi'
import { useParams } from 'next/navigation'

export function MailToolbar() {
  const params = useParams();
  const folder = params.folder || 'inbox';
  const { mails, setInboxCount } = useMailToolbar();
  const { selectedMails, handleSelectAll, handleMoveTo, handleMarkAsRead, handleDelete, handleClearSelection } = useMailActions();
  const isVisible = selectedMails.length > 0;
  const allSelected = selectedMails.length === mails.length && mails.length > 0;

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // If we're in inbox, decrement count by total emails being deleted
      if (folder === 'inbox') {
        setInboxCount((prev: number) => Math.max(0, prev - selectedMails.length));
      }
      
      await deleteEmails(ids);
      // The socket event will handle UI update, but we clear selection immediately
      handleClearSelection();
    } catch (error) {
      console.error('Failed to delete emails:', error);
      // Optionally show an error toast
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b"
        >
          <div className="flex h-16 items-center gap-4 px-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Checkbox
                        id="select-all"
                        aria-label="Select all"
                        checked={allSelected}
                        onCheckedChange={() => handleSelectAll(mails)}
                        className='h-5 w-5'
                    />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {allSelected ? 'Deselect all' : 'Select all'}
                </TooltipContent>
            </Tooltip>
            
            <p className="text-sm font-semibold">{selectedMails.length} selected</p>
            
            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(selectedMails, true)}>
                  <MailOpen className="h-5 w-5" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Mark as read</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleMoveTo(selectedMails, 'archive')}>
                  <Archive className="h-5 w-5" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Archive</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleBulkDelete(selectedMails.map(mail=>mail.id))}>
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Delete</TooltipContent>
            </Tooltip>

            <div className="ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleClearSelection}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Clear selection</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Clear selection</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
