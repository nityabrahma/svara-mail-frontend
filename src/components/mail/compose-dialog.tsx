import * as React from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast';

type ComposeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ComposeDialog({ open, onOpenChange }: ComposeDialogProps) {
    const { toast } = useToast()
    const [isSending, setIsSending] = React.useState(false);


    const handleSend = () => {
        setIsSending(true);
        // Simulate sending email
        setTimeout(() => {
            setIsSending(false);
            toast({
                title: "Email Sent!",
                description: "Your message has been successfully sent.",
            });
            onOpenChange(false);
        }, 1000)
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Compose a new email. Click send when you're ready.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To
            </Label>
            <Input id="to" placeholder="recipient@example.com" className="col-span-3 shadow-inner" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input id="subject" placeholder="Subject of your email" className="col-span-3 shadow-inner" />
          </div>
           <div className="grid grid-cols-1 items-center gap-4">
            <Textarea placeholder="Type your message here." id="message" className="min-h-[250px] shadow-inner" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSend} loading={isSending}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
