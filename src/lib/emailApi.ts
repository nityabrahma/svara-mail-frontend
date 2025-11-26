import type { Attachment } from './data';

export type Email = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subject: string;
  text: string;
  date: string;
  read: boolean;
  labels: string[];
  attachments?: Attachment[];
};

export async function getInboxEmails(): Promise<Email[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/inbox`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch inbox emails');
    }

    const data = await res.json();
    return data.emails;
  } catch (error) {
    console.error('Error fetching inbox emails:', error);
    throw error;
  }
}
