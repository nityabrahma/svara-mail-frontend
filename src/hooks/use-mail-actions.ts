'use client'

import { Email } from "@/lib/emailApi";
import { useToast } from "./use-toast";
import React, { createContext, useContext, useMemo, useState } from "react";

type MailActionsContextType = {
    selectedMails: Email[];
    handleSelect: (mail: Email) => void;
    handleSelectAll: (mails: Email[]) => void;
    handleClearSelection: () => void;
    handleReply: (mail: Email) => void;
    handleMoveTo: (mails: Email[], folder: 'inbox' | 'archive' | 'trash') => void;
    handleDelete: (mails: Email[]) => void;
    handleMarkAsRead: (mails: Email[], read: boolean) => void;
}

const MailActionsContext = createContext<MailActionsContextType | undefined>(undefined);

type MailToolbarContextType = {
    mails: Email[];
    setMails: (mails: Email[]) => void;
}

const MailToolbarContext = createContext<MailToolbarContextType | undefined>(undefined);


export const MailActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toast } = useToast();
    const [selectedMails, setSelectedMails] = useState<Email[]>([]);
    const [allMails, setAllMails] = useState<Email[]>([]);

    const handleSelect = (mail: Email) => {
        setSelectedMails(prevSelected => {
            if (prevSelected.some(m => m.id === mail.id)) {
                return prevSelected.filter(m => m.id !== mail.id);
            } else {
                return [...prevSelected, mail];
            }
        });
    };
    
    const handleSelectAll = (mails: Email[]) => {
        if (selectedMails.length === mails.length) {
          setSelectedMails([]);
        } else {
          setSelectedMails(mails);
        }
      };

    const handleClearSelection = () => {
        setSelectedMails([]);
    };
    
    const handleReply = (mail: Email) => {
        console.log('Replying to:', mail.id);
        toast({ title: "Reply", description: `Replying to "${mail.subject}".` });
        setSelectedMails([]);
    };

    const handleMoveTo = (mails: Email[], folder: 'inbox' | 'archive' | 'trash') => {
        console.log(`Moving ${mails.map(m => m.id).join(', ')} to ${folder}`);
        toast({ title: "Moved", description: `${mails.length} email(s) moved to ${folder}.` });
        setSelectedMails([]);
    };

    const handleDelete = (mails: Email[]) => {
        console.log('Deleting:', mails.map(m => m.id).join(', '));
        toast({ title: "Deleted", description: `${mails.length} email(s) permanently deleted.` });
        setSelectedMails([]);
    };
    
    const handleMarkAsRead = (mails: Email[], read: boolean) => {
        console.log(`Marking ${mails.map(m => m.id).join(', ')} as ${read ? 'read' : 'unread'}`);
        toast({ title: "Updated", description: `${mails.length} email(s) marked as ${read ? 'read' : 'unread'}.` });
        setSelectedMails([]);
    };
    
    const mailActionsValue = useMemo(() => ({
        selectedMails,
        handleSelect,
        handleSelectAll,
        handleClearSelection,
        handleReply,
        handleMoveTo,
        handleDelete,
        handleMarkAsRead,
    }), [selectedMails]);

    const mailToolbarValue = useMemo(() => ({
        mails: allMails,
        setMails: setAllMails,
    }), [allMails]);

    return (
        <MailActionsContext.Provider value={mailActionsValue}>
            <MailToolbarContext.Provider value={mailToolbarValue}>
                {children}
            </MailToolbarContext.Provider>
        </MailActionsContext.Provider>
    );
};

export function useMailActions() {
    const context = useContext(MailActionsContext);
    if (!context) {
        throw new Error("useMailActions must be used within a MailActionsProvider");
    }
    return context;
}

export function useMailToolbar() {
    const context = useContext(MailToolbarContext);
    if (!context) {
        throw new Error("useMailToolbar must be used within a MailActionsProvider");
    }
    return context;
}
