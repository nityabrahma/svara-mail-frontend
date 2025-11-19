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
import { Mail } from "@/lib/data"

interface MailActionsProps {
  mail: Mail
}

const MotionButton = motion(Button);

export function MailActions({ mail }: MailActionsProps) {
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
          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
          <DropdownMenuItem>Snooze</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
