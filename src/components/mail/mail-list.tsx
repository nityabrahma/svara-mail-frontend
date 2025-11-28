'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Email } from '@/lib/emailApi'
import { motion } from 'framer-motion'
import { MailContextMenu } from './mail-context-menu'
import { Checkbox } from '../ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

interface MailListProps {
  items: Email[];
  onSelectMail: (id: string) => void;
  selectedMailId?: string | null;
  selectedMails: Email[];
  onSelect: (mail: Email) => void;
  loadMore: () => void;
  hasNextPage: boolean;
  loadingMore: boolean;
}

const MotionButton = motion.button;

export function MailList({ 
  items, 
  onSelectMail, 
  selectedMailId, 
  selectedMails, 
  onSelect, 
  loadMore,
  hasNextPage,
  loadingMore,
}: MailListProps) {
  const [contextMenuMail, setContextMenuMail] = React.useState<Email | null>(null);
  const [contextMenuOpen, setContextMenuOpen] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ top: 0, left: 0 });

  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const lastItemRef = React.useCallback((node: HTMLButtonElement | null) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMore();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasNextPage, loadMore]);

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
        {items.map((item, index) => {
          const isUnread = !item.read;
          const isLastItem = index === items.length - 1;

          return (
            <MotionButton
              ref={isLastItem ? lastItemRef : null}
              key={item.id}
              onClick={() => isSelectionMode ? onSelect(item) : onSelectMail(item.id)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex flex-col items-start gap-2 px-4 py-3 text-left text-sm transition-all hover:bg-secondary/80 hover:text-secondary-foreground border-b",
                selectedMailId === item.id && "bg-secondary text-secondary-foreground",
                isUnread && !isSelected(item.id) && "bg-secondary/70"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                  {isSelectionMode ? (
                    <Checkbox
                      checked={isSelected(item.id)}
                      onCheckedChange={() => onSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-5 w-5"
                    />
                  ) : (
                    isUnread && <span className="absolute left-2 top-1/2 -translate-y-1/2 flex h-2 w-2 rounded-full bg-primary" />
                  )}

                  <div
                    className={cn(
                      !isUnread && "text-muted-foreground",
                      isUnread && "font-semibold",
                      "text-base w-1/5",
                      {"pl-4": !isSelectionMode && isUnread}
                    )}
                  >
                    {(isUnread ? item.name.charAt(0).toUpperCase() : item.name.charAt(0).toLowerCase()) + item.name.slice(1)}
                  </div>

                  <div className={cn("flex-1 truncate w-4/5")}>
                    <span className={cn(
                      !isUnread && "text-muted-foreground font-normal",
                      isUnread && "font-semibold",
                      "text-base truncate"
                    )}>
                      {item.subject}
                    </span>
                    <span className={cn(
                      !isUnread && "text-muted-foreground",
                      isUnread ? "text-foreground" : "text-muted-foreground",
                      "ml-2 truncate font-normal"
                    )}>
                      - {item.body.substring(0, 100)}
                    </span>
                  </div>
                </div>

                <div className={cn("ml-4 text-xs whitespace-nowrap", selectedMailId === item.id ? "text-secondary-foreground" : "text-muted-foreground")}>
                  {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                </div>
              </div>
            </MotionButton>
          );
        })}

        {loadingMore && (
          <div className="flex flex-col items-start gap-2 p-4 text-left text-sm border-b">
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40 mt-2" />
              </div>
            </div>
        )}

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
      </div>
    </ScrollArea>
  );
}
