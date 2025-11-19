import { format } from 'date-fns'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Mail } from '@/lib/data'
import { MailActions } from './mail-actions'

interface MailDisplayProps {
  mail: Mail | null
}

export function MailDisplay({ mail }: MailDisplayProps) {
  if (!mail) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No message selected
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-4">
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
      <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
        <div className="flex items-end p-2">
            <div className="grid gap-1.5">
                <h1 className="font-headline text-2xl font-bold">{mail.subject}</h1>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(mail.date), 'PPpp')}
                </p>
            </div>
        </div>
        <Separator className='my-4' />
        {mail.text}
      </div>
    </div>
  )
}
