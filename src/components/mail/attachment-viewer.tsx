import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Attachment } from "@/lib/data"
import { Download, File as FileIcon, Music, Video, X } from "lucide-react"
import Image from "next/image"

type AttachmentViewerProps = {
  attachment: Attachment | null;
  onOpenChange: (open: boolean) => void;
};

export function AttachmentViewer({ attachment, onOpenChange }: AttachmentViewerProps) {
  if (!attachment) return null;

  const renderContent = () => {
    switch (attachment.type) {
      case 'image':
        return (
            <div className="relative w-full h-[70vh]">
                <Image src={attachment.url} alt={attachment.name} layout="fill" objectFit="contain" />
            </div>
        )
      case 'video':
        return <video src={attachment.url} controls className="w-full max-h-[70vh] rounded-md" />;
      case 'audio':
        return <audio src={attachment.url} controls className="w-full" />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-secondary rounded-md">
            <FileIcon className="h-24 w-24 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">{attachment.name}</p>
            <p className="text-muted-foreground">{attachment.size}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!attachment} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-4 pr-14">
          <DialogTitle className="truncate">{attachment.name}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
            {renderContent()}
        </div>
        <DialogFooter className="p-4 border-t bg-secondary/50">
            <a href={attachment.url} download={attachment.name}>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
