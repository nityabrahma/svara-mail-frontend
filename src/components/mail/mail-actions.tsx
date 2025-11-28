'use client';

import { Archive, Clock, Forward, MoreVertical, Reply, ReplyAll, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Email, deleteEmails, markEmailsAsSeen } from "@/lib/emailApi"
import { useAppRouter } from "@/hooks/use-router"
import { useParams } from "next/navigation"
import { useMailToolbar } from "@/hooks/use-mail-actions"

interface MailActionsProps {
  mail: Email
}

const MotionButton = motion(Button);


export function MailActions({ mail }: MailActionsProps) {
  const router = useAppRouter()
  const params = useParams()
  const folder = params.folder || 'inbox'
  const { setInboxCount } = useMailToolbar()

  const handleDelete = async (id: string) => {
    // If we're in inbox, decrement count (total emails, not just unread)
    if (folder === 'inbox') {
      setInboxCount((prev: number) => Math.max(0, prev - 1));
    }
    
    await deleteEmails([id]);
    // Navigate back to the folder list after deletion
    router.push(`/${folder}`)
  }

  const handleMarkAsUnread = async (id: string) => {
    try {
      await markEmailsAsSeen([id]);
      router.push(`/${folder}`);
    } catch (error) {
      console.error('Failed to mark email as unread:', error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <MotionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} variant="ghost" size="icon" disabled={!mail}>
            <Reply className="h-4 w-4" />
            <span className="sr-only">Reply</span>
          </MotionButton>
        </TooltipTrigger>
        <TooltipContent>Reply</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <MotionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} variant="ghost" size="icon" disabled={!mail}>
            <ReplyAll className="h-4 w-4" />
            <span className="sr-only">Reply all</span>
          </MotionButton>
        </TooltipTrigger>
        <TooltipContent>Reply all</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <MotionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} variant="ghost" size="icon" disabled={!mail}>
            <Forward className="h-4 w-4" />
            <span className="sr-only">Forward</span>
          </MotionButton>
        </TooltipTrigger>
        <TooltipContent>Forward</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MotionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} variant="ghost" size="icon" disabled={!mail}>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More</span>
          </MotionButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleMarkAsUnread(mail.id)}>Mark as unread</DropdownMenuItem>
          <DropdownMenuItem>Snooze</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(mail.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

