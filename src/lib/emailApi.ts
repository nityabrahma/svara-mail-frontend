import type { Attachment } from "./data";
export type {Attachment}

// -------------------------------
// Email Type
// -------------------------------
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

// -------------------------------
// Attachment Mapper
// -------------------------------
function mapAttachment(a: any): Attachment {
  let type: "image" | "video" | "audio" | "file" = "file";

  if (a.content_type?.startsWith("image")) type = "image";
  else if (a.content_type?.startsWith("video")) type = "video";
  else if (a.content_type?.startsWith("audio")) type = "audio";

  return {
    name: a.filename || "attachment",
    type,
    url: a.file_url,
    previewUrl: a.file_url,
    size: `${Math.round((a.file_size || 0) / 1024)} KB`,
  };
}

// -------------------------------
// Email Mapper
// -------------------------------
function mapEmail(item: any): Email {
  const sender = item.from_address || "";

  // Assign labels based on item properties
  const labels: string[] = [];
  if (item.is_archived) labels.push("archive");
  if (item.is_trashed) labels.push("trash");
  if (item.folder?.toLowerCase() === 'sent') labels.push('sent');
  if (item.folder?.toLowerCase() === 'drafts') labels.push('drafts');
  if (item.folder?.toLowerCase() === 'junk') labels.push('junk');
  
  // If no specific label is assigned, it's in the inbox
  if (labels.length === 0) {
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

// -------------------------------
// GET ALL INBOX EMAILS
// -------------------------------
export async function getInboxEmails(): Promise<Email[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/inbox`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch inbox emails");
    }

    const json = await res.json();
    const items = json.data || [];
    
    return items.map(mapEmail);
  } catch (error) {
    console.error("Error fetching inbox emails:", error);
    throw error;
  }
}

// -------------------------------
// GET SINGLE EMAIL BY ID
// -------------------------------
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
