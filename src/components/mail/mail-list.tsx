'use client'

import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Email } from '@/lib/emailApi'
import { motion } from 'framer-motion'

interface MailListProps {
  items: Email[]
  onSelectMail: (id: string) => void
  selectedMailId?: string | null
}

const MotionButton = motion.button;

export function MailList({ items, onSelectMail, selectedMailId }: MailListProps) {

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {items.map((item) => (
          <MotionButton
            key={item.id}
            onClick={() => onSelectMail(item.id)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex flex-col items-start gap-2 p-4 text-left text-sm transition-all hover:bg-secondary/80 hover:text-secondary-foreground border-b',
              selectedMailId === item.id && 'bg-secondary text-secondary-foreground'
            )}
          >
             
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}

                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    selectedMailId === item.id
                      ? 'text-secondary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-1 text-xs text-muted-foreground">
              <p>{item.body.substring(0, 20)}...</p>
            </div>
          </MotionButton>
        ))}
      </div>
    </ScrollArea>
  )
}
