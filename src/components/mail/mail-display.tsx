'use client'

import * as React from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Mail, Attachment } from '@/lib/data'
import { MailActions } from './mail-actions'
import { MotionButton } from '../ui/button'
import { ArrowLeft, Download, Paperclip, File as FileIcon, Music, Video } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useRouter } from 'next/navigation'
import { AttachmentViewer } from './attachment-viewer'
import { Card } from '../ui/card'

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const router = useRouter()
  const [selectedAttachment, setSelectedAttachment] = React.useState<Attachment | null>(null)

  if (!mail) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No message selected
      </div>
    )
  }

  const getAttachmentIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'audio':
        return <Music className="h-6 w-6" />;
      default:
        return <FileIcon className="h-6 w-6" />;
    }
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center p-4">
          <Tooltip>
              <TooltipTrigger asChild>
                  <MotionButton 
                      onClick={() => router.back()}
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      variant="ghost" 
                      size="icon"
                      className="mr-2"
                  >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                  </MotionButton>
              </TooltipTrigger>
              <TooltipContent>Back</TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={mail.avatar} alt={mail.name} data-ai-hint="person face" />
              <AvatarFallback>
                {mail.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-semibold">{mail.name}</p>
              <p className="text-xs text-muted-foreground">
                {mail.email}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <MailActions mail={mail} />
          </div>
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-end p-2">
              <div className="grid gap-1.5">
                  <h1 className="font-headline text-2xl font-bold">{mail.subject}</h1>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(mail.date), 'PPpp')}
                  </p>
              </div>
          </div>
          <Separator className='my-4' />
          <div className="whitespace-pre-wrap text-sm">
            {mail.text}
          </div>
          
          {mail.attachments && mail.attachments.length > 0 && (
            <div className="mt-8">
              <Separator />
              <div className="py-4">
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{mail.attachments.length} Attachment{mail.attachments.length > 1 ? 's' : ''}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mail.attachments.map((att, index) => (
                    <Card key={index} className="group relative overflow-hidden rounded-lg cursor-pointer" onClick={() => setSelectedAttachment(att)}>
                      {att.type === 'image' && att.previewUrl ? (
                        <Image src={att.previewUrl} alt={att.name} width={200} height={150} className="h-full w-full object-cover transition-transform group-hover:scale-105" data-ai-hint="attachment preview"/>
                      ) : (
                         <div className="flex h-32 w-full items-center justify-center bg-secondary">
                          {getAttachmentIcon(att.type)}
                        </div>
                      )}
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={att.url} download onClick={(e) => e.stopPropagation()}>
                            <MotionButton size="icon" variant="outline" className="h-10 w-10 bg-white/20 backdrop-blur-sm border-none hover:bg-white/30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}}>
                                <Download className="h-5 w-5" />
                            </MotionButton>
                          </a>
                        </div>
                      <div className="p-2 bg-card">
                        <p className="text-sm font-medium truncate">{att.name}</p>
                        <p className="text-xs text-muted-foreground">{att.size}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedAttachment && (
        <AttachmentViewer 
            attachment={selectedAttachment}
            onOpenChange={(isOpen) => !isOpen && setSelectedAttachment(null)}
        />
      )}
    </>
  )
}
