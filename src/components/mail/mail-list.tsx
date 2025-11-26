'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Email } from '@/lib/emailApi'
import { motion } from 'framer-motion'
import { MailContextMenu } from './mail-context-menu'
import { useMailActions } from '@/hooks/use-mail-actions'

interface MailListProps {
  items: Email[]
  onSelectMail: (id: string) => void
  selectedMailId?: string | null
}

const MotionButton = motion.button;

export function MailList({ items, onSelectMail, selectedMailId }: MailListProps) {
  const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number, mail: Email } | null>(null);
  const mailActions = useMailActions();

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>, mail: Email) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, mail });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      <ScrollArea className="h-full" onMouseDownCapture={closeContextMenu}>
        <div className="flex flex-col">
          {items.map((item) => (
            <MotionButton
              key={item.id}
              onClick={() => onSelectMail(item.id)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex flex-col items-start gap-2 p-4 text-left text-sm transition-all hover:bg-secondary/80 hover:text-secondary-foreground border-b',
                selectedMailId === item.id && 'bg-secondary text-secondary-foreground',
                !item.read && 'bg-secondary/70'
              )}
            >
              <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4 w-full">
                      <div className="flex items-center gap-2 w-1/5">
                          {!item.read && (
                              <span className="flex h-2 w-2 rounded-full bg-primary" />
                          )}
                          <div className="font-semibold text-base">
                              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                          </div>
                      </div>
                      <div className="flex-1 truncate w-4/5">
                          <span className="font-bold truncate">{item.subject}</span>
                          <span className="text-muted-foreground ml-2 truncate">
                             - {item.body.substring(0, 100)}
                          </span>
                      </div>
                  </div>
                  <div
                    className={cn(
                      'ml-4 text-xs whitespace-nowrap',
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
            </MotionButton>
          ))}
        </div>
      </ScrollArea>
      <MailContextMenu
        open={!!contextMenu}
        onOpenChange={(isOpen) => !isOpen && setContextMenu(null)}
        position={contextMenu ? { top: contextMenu.y, left: contextMenu.x } : undefined}
        mail={contextMenu?.mail}
        actions={mailActions}
      />
    </>
  )
}
