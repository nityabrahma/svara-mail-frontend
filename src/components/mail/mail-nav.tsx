'use client'

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Archive, File, Inbox, Send, Trash2, FileEdit } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { ComposeDialog } from './compose-dialog';
import { useSidebar } from '../ui/sidebar';

const navLinks = [
  { title: 'Inbox', label: '128', icon: Inbox, variant: 'default', folder: 'inbox' },
  { title: 'Drafts', label: '9', icon: File, variant: 'ghost', folder: 'drafts' },
  { title: 'Sent', label: '', icon: Send, variant: 'ghost', folder: 'sent' },
  { title: 'Junk', label: '23', icon: Archive, variant: 'ghost', folder: 'junk' },
  { title: 'Trash', label: '', icon: Trash2, variant: 'ghost', folder: 'trash' },
];

export function MailNav() {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const params = useParams();
    const currentFolder = params.folder || 'inbox';
    const [isComposeOpen, setComposeOpen] = React.useState(false);

  return (
    <div className="flex h-full flex-col p-2">
      <div className="p-2">
        <ComposeDialog open={isComposeOpen} onOpenChange={setComposeOpen} />
            {isCollapsed ? (
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button variant="default" className="h-9 w-9" onClick={() => setComposeOpen(true)}>
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Compose</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-4">
                        Compose
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Button variant="default" className="w-full justify-start" onClick={() => setComposeOpen(true)}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Compose
                </Button>
            )}
      </div>

      <Separator className="my-2" />

      <nav className="grid gap-1 px-2">
        {navLinks.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/${link.folder}`}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    currentFolder === link.folder && 'bg-accent text-foreground'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={`/${link.folder}`}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground',
                currentFolder === link.folder && 'bg-accent font-semibold text-foreground'
              )}
            >
              <link.icon className="mr-3 h-5 w-5" />
              {link.title}
              {link.label && (
                <span className={cn('ml-auto', currentFolder === link.folder && 'text-foreground')}>{link.label}</span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
