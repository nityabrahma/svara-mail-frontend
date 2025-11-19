'use client'

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Archive, File, Inbox, Send, Trash2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '../ui/sidebar';
import { Logo } from '../logo';

const navLinks = [
  { title: 'Inbox', label: '128', icon: Inbox, variant: 'default', folder: 'all' },
  { title: 'Drafts', label: '9', icon: File, variant: 'ghost', folder: 'drafts' },
  { title: 'Sent', label: '', icon: Send, variant: 'ghost', folder: 'sent' },
  { title: 'Junk', label: '23', icon: Archive, variant: 'ghost', folder: 'junk' },
  { title: 'Trash', label: '', icon: Trash2, variant: 'ghost', folder: 'trash' },
];

const MotionLink = motion(Link);

export function MailNav({ onComposeClick }: { onComposeClick: () => void }) {
    const { state, isMobile } = useSidebar();
    const isCollapsed = !isMobile && state === 'collapsed';
    const params = useParams();
    const currentFolder = params.folder || 'all';

  return (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="flex flex-col gap-1">
        {isMobile && <Logo className="p-2 pt-4" />}
        <div className="grid gap-1 px-2 pt-4">
            {navLinks.map((link, index) =>
            isCollapsed ? (
                <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                    <MotionLink
                    href={`/${link.folder}`}
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                        currentFolder === link.folder && 'bg-accent text-accent-foreground'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    >
                    <link.icon className="h-6 w-6" />
                    <span className="sr-only">{link.title}</span>
                    </MotionLink>
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
                <MotionLink
                key={index}
                href={`/${link.folder}`}
                className={cn(
                    'flex items-center rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                    currentFolder === link.folder && 'bg-accent font-semibold text-accent-foreground'
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                >
                <link.icon className="mr-4 h-6 w-6" />
                {link.title}
                {link.label && (
                    <span className={cn('ml-auto', currentFolder === link.folder && 'text-accent-foreground')}>{link.label}</span>
                )}
                </MotionLink>
            )
            )}
        </div>
      </div>


      <div>
        <Separator className="my-2" />
        <div className="grid gap-1 px-2">
         {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <MotionLink
                  href="/settings"
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                    params.folder === 'settings' && 'bg-accent text-accent-foreground'
                  )}
                   whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="h-6 w-6" />
                  <span className="sr-only">Settings</span>
                </MotionLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <MotionLink
              href="/settings"
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                params.folder === 'settings' && 'bg-accent font-semibold text-accent-foreground'
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="mr-4 h-6 w-6" />
              Settings
            </MotionLink>
          )}
        </div>
      </div>
    </div>
  );
}
