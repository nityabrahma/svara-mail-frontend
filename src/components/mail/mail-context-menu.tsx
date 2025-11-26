'use client';

import * as React from 'react';
import {
  Popover,
  PopoverContent,
} from '@/components/ui/popover';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Email } from '@/lib/emailApi';
import { useMailActions } from '@/hooks/use-mail-actions';
import { Archive, ArrowRight, CornerDownLeft, Trash, CheckSquare } from 'lucide-react';
import { PopoverAnchor } from '@radix-ui/react-popover';

type MailContextMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: { top: number; left: number };
  mail: Email | null;
  actions: ReturnType<typeof useMailActions>;
};

export function MailContextMenu({ open, onOpenChange, position, mail, actions }: MailContextMenuProps) {
  if (!mail || !position) return null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor style={position} />
      <PopoverContent className="w-56 p-1">
        <DropdownMenuItem onClick={() => actions.handleSelect(mail)}>
          <CheckSquare className="mr-2" /> Select
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.handleReply(mail)}>
          <CornerDownLeft className="mr-2" /> Reply
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => actions.handleMoveTo(mail, 'archive')}>
          <Archive className="mr-2" /> Move to Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.handleMoveTo(mail, 'trash')} className="text-destructive focus:text-destructive">
          <Trash className="mr-2" /> Move to Trash
        </DropdownMenuItem>
      </PopoverContent>
    </Popover>
  );
}
