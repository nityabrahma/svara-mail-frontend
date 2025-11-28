import { Attachment } from "./data";

const mapAttachment = (item: any): Attachment => {
  return {
    id: String(item.id),
    filename: item.filename,
    content_type: item.content_type,
    size: item.size,
    url: item.url,
  };
}

export type Email = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subject: string;
  body: string;
  text: string;
  date: string;
  read: boolean;
  labels: string[];
  attachments?: Attachment[];
};
export interface PaginatedEmailResponse {
  data: Email[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const mapEmail = (item: any): Email => {
 const sender = item.from_address || item.email || "";

 const labels: string[] = Array.isArray(item.labels) ? [...item.labels] : [];
 if (item.is_archived && !labels.includes("archive")) labels.push("archive");
 if (item.is_trashed && !labels.includes("trash")) labels.push("trash");
 if (item.folder?.toLowerCase() === 'sent' && !labels.includes('sent')) labels.push('sent');
 if (item.folder?.toLowerCase() === 'drafts' && !labels.includes('drafts')) labels.push('drafts');
 if (item.folder?.toLowerCase() === 'junk' && !labels.includes('junk')) labels.push('junk');
 
 if (labels.length === 0 && !item.folder) {
     labels.push('inbox');
 }

 return {
   id: String(item.id),
   name: sender.split("@")[0] || "Unknown",
   email: sender,
   avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${sender}`,
   subject: item.subject || "(No subject)",
   body: item.body,
   text: item.html_body || item.body || "",
   date: item.created_at || new Date().toISOString(),
   read: item.is_seen??false,
   labels: labels,
   attachments: (item.attachments || []).map(mapAttachment),
 };
}

export async function getInboxEmails(page = 1, limit = 20): Promise<PaginatedEmailResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/inbox?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch inbox emails");
    }

    const json = await res.json();
    return {
      data: (json.data || []).map(mapEmail),
      pagination: json.pagination,
    };

  } catch (error) {
    console.error("Error fetching inbox emails:", error);
    throw error;
  }
}

export async function getInboxById(id: string): Promise<Email | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch email with id ${id}`);
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    return mapEmail(item);
  } catch (error) {
    console.error(`Error fetching email with id ${id}:`, error);
    return null;
  }
}
