'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Email } from '@/lib/emailApi';
import { useMailActions } from '@/hooks/use-mail-actions';
import { Archive, CornerDownLeft, Trash, CheckSquare } from 'lucide-react';

type MailContextMenuProps = {
  children: React.ReactNode;
  mail: Email;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
};

export function MailContextMenu({ children, mail, onOpenChange, triggerRef }: MailContextMenuProps) {
  const actions = useMailActions();

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent 
            className="w-56" 
            align="start"
            onCloseAutoFocus={(e) => e.preventDefault()}
            style={{
                left: triggerRef.current ? `${triggerRef.current.style.left}` : 0,
                top: triggerRef.current ? `${triggerRef.current.style.top}` : 0,
            }}
        >
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
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}