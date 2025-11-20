'use client'

import { ComponentProps } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mail } from '@/lib/data'
import { useParams } from 'next/navigation'

interface MailListProps {
  items: Mail[]
  onSelectMail: (id: string) => void
  selectedMailId?: string | null
}

export function MailList({ items, onSelectMail, selectedMailId }: MailListProps) {
  const params = useParams()
  const mailId = selectedMailId === undefined ? params.mailId : selectedMailId

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-6 pt-8">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectMail(item.id)}
            className={cn(
              'flex flex-col items-start gap-2 border p-6 text-left text-sm transition-all hover:bg-secondary/80 hover:text-secondary-foreground',
              'rounded-[40px]',
              mailId === item.id && 'bg-secondary text-secondary-foreground'
            )}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    mailId === item.id
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
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
