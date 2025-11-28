'use client'

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Archive, File, Inbox, Send, Trash2, Settings, Mail } from 'lucide-react';
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
import { useAppRouter } from '@/hooks/use-router';

const navLinks = [
  { title: 'All Mails', label: '128', icon: Mail, variant: 'default', folder: 'all' },
  { title: 'Inbox', label: '', icon: Inbox, variant: 'ghost', folder: 'inbox' },
  { title: 'Drafts', label: '9', icon: File, variant: 'ghost', folder: 'drafts' },
  { title: 'Sent', label: '', icon: Send, variant: 'ghost', folder: 'sent' },
  { title: 'Junk', label: '23', icon: Archive, variant: 'ghost', folder: 'junk' },
  { title: 'Trash', label: '', icon: Trash2, variant: 'ghost', folder: 'trash' },
];

const MotionButton = motion.button;

export function MailNav({ onComposeClick, inboxCount }: { onComposeClick: () => void; inboxCount?: number }) {
    const { state, isMobile } = useSidebar();
    const isCollapsed = !isMobile && state === 'collapsed';
    const params = useParams();
    const router = useAppRouter();
    const currentFolder = params.folder || 'inbox';

    // Update the inbox label with the count
    const getLabel = (link: typeof navLinks[0]) => {
        if (link.folder === 'inbox' && inboxCount !== undefined) {
            return String(inboxCount);
        }
        return link.label;
    };

    const handleNavClick = (folder: string) => {
        router.push(`/${folder}`);
    }

  return (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="flex flex-col gap-1">
        {isMobile && <Logo className="p-2 pt-4" />}
        <div className="grid gap-1 px-2 pt-4">
            {navLinks.map((link, index) =>
            isCollapsed ? (
                <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                    <MotionButton
                    onClick={() => handleNavClick(link.folder)}
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground',
                        currentFolder === link.folder && 'bg-secondary text-secondary-foreground'
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    >
                    <link.icon className="h-6 w-6" />
                    <span className="sr-only">{link.title}</span>
                    </MotionButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                    {link.title}
                    {getLabel(link) && (
                    <span className="ml-auto text-muted-foreground">
                        {getLabel(link)}
                    </span>
                    )}
                </TooltipContent>
                </Tooltip>
            ) : (
                <MotionButton
                    key={index}
                    onClick={() => handleNavClick(link.folder)}
                    className={cn(
                        'flex items-center rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground text-left',
                        currentFolder === link.folder && 'bg-secondary font-semibold text-secondary-foreground'
                    )}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <link.icon className="mr-4 h-6 w-6" />
                    {link.title}
                    {getLabel(link) && (
                        <span className={cn('ml-auto', currentFolder === link.folder && 'text-secondary-foreground')}>{getLabel(link)}</span>
                    )}
                </MotionButton>
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
                <MotionButton
                  onClick={() => router.push('/settings')}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground',
                    params.folder === 'settings' && 'bg-secondary text-secondary-foreground'
                  )}
                   whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="h-6 w-6" />
                  <span className="sr-only">Settings</span>
                </MotionButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <MotionButton
              onClick={() => router.push('/settings')}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground text-left',
                params.folder === 'settings' && 'bg-secondary font-semibold text-secondary-foreground'
              )}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="mr-4 h-6 w-6" />
              Settings
            </MotionButton>
          )}
        </div>
      </div>
    </div>
  );
}
