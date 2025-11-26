'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Email } from '@/lib/emailApi';
import { useMailActions } from '@/hooks/use-mail-actions';
import { Archive, CornerDownLeft, Trash, CheckSquare } from 'lucide-react';

type MailContextMenuProps = {
  children: React.ReactNode;
  mail: Email;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  position: { top: number; left: number };
};

export function MailContextMenu({ mail, onOpenChange, open, position }: MailContextMenuProps) {
  const actions = useMailActions();

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.handleSelect(mail);
    onOpenChange(false);
  };
  
  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.handleReply(mail);
    onOpenChange(false);
  };
  
  const handleMoveToArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.handleMoveTo(mail, 'archive');
    onOpenChange(false);
  };
  
  const handleMoveToTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.handleMoveTo(mail, 'trash');
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor style={{ position: 'absolute', top: position.top, left: position.left }} />
      <PopoverContent className="w-56 p-2" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSelect}>
                <CheckSquare className="h-4 w-4" />
                <span>Select</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleReply}>
                <CornerDownLeft className="h-4 w-4" />
                <span>Reply</span>
            </Button>
            <div className="my-1 h-px bg-muted" />
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleMoveToArchive}>
                <Archive className="h-4 w-4" />
                <span>Move to Archive</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive focus:text-destructive" onClick={handleMoveToTrash}>
                <Trash className="h-4 w-4" />
                <span>Move to Trash</span>
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
