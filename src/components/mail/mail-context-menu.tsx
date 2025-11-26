'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Email } from '@/lib/emailApi';
import { useMailActions } from '@/hooks/use-mail-actions';
import { Archive, CornerDownLeft, Trash, CheckSquare } from 'lucide-react';

type MailContextMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mail: Email | null;
  children: React.ReactNode;
  actions: ReturnType<typeof useMailActions>;
};

export function MailContextMenu({ open, onOpenChange, mail, actions, children }: MailContextMenuProps) {
  if (!mail) return <>{children}</>;

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" alignOffset={-5}>
        <DropdownMenuItem onClick={() => actions.handleSelect(mail)}>
          <CheckSquare className="mr-2 h-4 w-4" /> 
          <span>Select</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.handleReply(mail)}>
          <CornerDownLeft className="mr-2 h-4 w-4" /> 
          <span>Reply</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => actions.handleMoveTo(mail, 'archive')}>
          <Archive className="mr-2 h-4 w-4" /> 
          <span>Move to Archive</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.handleMoveTo(mail, 'trash')} className="text-destructive focus:text-destructive">
          <Trash className="mr-2 h-4 w-4" /> 
          <span>Move to Trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
