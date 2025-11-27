'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Email } from '@/lib/emailApi'
import { motion } from 'framer-motion'
import { MailContextMenu } from './mail-context-menu'
import { Checkbox } from '../ui/checkbox'

interface MailListProps {
  items: Email[]
  onSelectMail: (id: string) => void
  selectedMailId?: string | null
  selectedMails: Email[]
  onSelect: (mail: Email) => void;
}

const MotionButton = motion.button;

export function MailList({ items, onSelectMail, selectedMailId, selectedMails, onSelect }: MailListProps) {
  const [contextMenuMail, setContextMenuMail] = React.useState<Email | null>(null);
  const [contextMenuOpen, setContextMenuOpen] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ top: 0, left: 0 });

  const handleContextMenu = (event: React.MouseEvent, mail: Email) => {
    event.preventDefault();
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    setContextMenuMail(mail);
    setContextMenuOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setContextMenuOpen(open);
    if (!open) setContextMenuMail(null);
  };

  const isSelectionMode = selectedMails.length > 0;
  const isSelected = (id: string) => selectedMails.some(m => m.id === id);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {items.map((item) => {

          const isUnread = !item.read;

          return (
            <MotionButton
              key={item.id}
              onClick={() => isSelectionMode ? onSelect(item) : onSelectMail(item.id)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-start gap-2 p-4 text-left text-sm transition-all hover:bg-secondary/80 hover:text-secondary-foreground border-b",
                selectedMailId === item.id && "bg-secondary text-secondary-foreground",
                isUnread && !isSelected(item.id) && "bg-secondary/70"
              )}
            >
              <div className="flex w-full items-center justify-between">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-4 w-full">


                  {isSelectionMode ? (
                    <Checkbox
                      checked={isSelected(item.id)}
                      onCheckedChange={() => onSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-5 w-5"
                    />
                  ) : (
                    isUnread && <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}

                  {/* APPLY muted color when seen */}
                  <div
                    className={cn(
                      !isUnread && "text-muted-foreground",
                      isUnread && "font-semibold",
                      "text-base w-1/5 truncate"
                    )}
                  >
                    {(isUnread ? item.name.charAt(0).toUpperCase() : item.name.charAt(0).toLowerCase()) + item.name.slice(1)}
                  </div>

                  {/* SUBJECT + BODY */}
                  <div
                    className={cn(
                      !isUnread && "text-muted-foreground",
                      "flex-1 truncate w-4/5"
                    )}
                  >
                    <span
                      className={cn(
                        isUnread && "font-bold",
                        "truncate"
                      )}
                    >
                      {item.subject}
                    </span>

                    <span
                      className={cn(
                        isUnread && "font-semibold text-muted-foreground",
                        "ml-2 truncate"
                      )}
                    >
                      - {item.body.substring(0, 100)}
                    </span>
                  </div>
                </div>

                {/* TIME */}
                <div
                  className={cn(
                    "ml-4 text-xs whitespace-nowrap",
                    selectedMailId === item.id
                      ? "text-secondary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                </div>
              </div>
            </MotionButton>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenuMail && (
        <MailContextMenu
          mail={contextMenuMail}
          open={contextMenuOpen}
          onOpenChange={handleOpenChange}
          position={contextMenuPosition}
          onSelect={onSelect}
        >
          <div />
        </MailContextMenu>
      )}
    </ScrollArea>
  )
}
