'use client'

import { Email } from "@/lib/emailApi";
import { createContext, useContext } from "react";

type MailActionsContextType = {
    selectedMails: Email[];
    handleSelect: (mail: Email) => void;
    handleSelectAll: (mails: Email[]) => void;
    handleClearSelection: () => void;
    handleReply: (mail: Email) => void;
    handleMoveTo: (mails: Email[] | Email, folder: 'inbox' | 'archive' | 'trash') => void;
    handleDelete: (mails: Email[]) => void;
    handleMarkAsRead: (mails: Email[], read: boolean) => void;
}

export const MailActionsContext = createContext<MailActionsContextType | undefined>(undefined);

type MailToolbarContextType = {
    mails: Email[];
    setMails: (mails: Email[]) => void;
    inboxCount: number;
    setInboxCount: (count: number | ((prev: number) => number)) => void;
}

export const MailToolbarContext = createContext<MailToolbarContextType | undefined>(undefined);

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
