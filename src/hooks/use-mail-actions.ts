import { Email } from "@/lib/emailApi";
import { useToast } from "./use-toast";
import React from "react";

export function useMailActions() {
    const { toast } = useToast();
    const [selectedMails, setSelectedMails] = React.useState<Email[]>([]);

    const handleSelect = (mail: Email) => {
        setSelectedMails(prevSelected => {
            if (prevSelected.some(m => m.id === mail.id)) {
                return prevSelected.filter(m => m.id !== mail.id);
            } else {
                return [...prevSelected, mail];
            }
        });
    };

    const handleReply = (mail: Email) => {
        // This could open a compose dialog with the 'to' field pre-filled
        console.log('Replying to:', mail.id);
        toast({ title: "Reply", description: `Replying to "${mail.subject}".` });
    };

    const handleMoveTo = (mail: Email, folder: 'inbox' | 'archive' | 'trash') => {
        // This would make an API call to move the email
        console.log(`Moving ${mail.id} to ${folder}`);
        toast({ title: "Moved", description: `Email moved to ${folder}.` });
    };

    const handleDelete = (mail: Email) => {
        // This would make an API call to permanently delete the email
        console.log('Deleting:', mail.id);
        toast({ title: "Deleted", description: "Email permanently deleted." });
    };

    return {
        selectedMails,
        handleSelect,
        handleReply,
        handleMoveTo,
        handleDelete,
    };
}
