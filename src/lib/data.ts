import type { placeholderImages } from './placeholder-images.json';

export type Mail = {
  id: string;
  name: string;
  email: string;
  avatar: (typeof placeholderImages)[number]['imageUrl'];
  subject: string;
  text: string;
  date: string;
  read: boolean;
  labels: string[];
};

export const mails: Mail[] = [
  {
    id: 'a1b2c3d4e5',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    avatar: 'https://picsum.photos/seed/avatar1/40/40',
    subject: 'Project Update & Next Steps',
    text: "Hi Team,\n\nJust wanted to share a quick update on the Project Phoenix. We've successfully completed the initial design phase and are now moving into development. I've attached the latest mockups for your review. Please provide your feedback by EOD Friday.\n\nNext steps will be to finalize the feature set for the MVP. Let's schedule a meeting for next week to discuss.\n\nBest,\nAlice",
    date: '2024-05-20T10:30:00',
    read: true,
    labels: ['inbox', 'work'],
  },
  {
    id: 'f6g7h8i9j0',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    avatar: 'https://picsum.photos/seed/avatar2/40/40',
    subject: 'Your recent order is on its way!',
    text: 'Hello,\n\nGreat news! Your order #A12345678 has been shipped and is expected to arrive by May 25th. You can track your package using the link below.\n\n[Track Package]\n\nWe hope you enjoy your purchase!\n\nThanks,\nThe Store Team',
    date: '2024-05-20T09:00:00',
    read: false,
    labels: ['inbox', 'shopping'],
  },
  {
    id: 'k1l2m3n4o5',
    name: 'Carol White',
    email: 'carol.w@example.com',
    avatar: 'https://picsum.photos/seed/avatar3/40/40',
    subject: 'Weekly Newsletter: Top 10 Design Trends',
    text: "Hey!\n\nThis week, we're diving into the top 10 design trends that are shaping the industry. From brutalism to neomorphism, find out what's hot and what's not.\n\nClick here to read the full article.\n\nStay inspired,\nCarol",
    date: '2024-05-19T15:45:00',
    read: true,
    labels: ['inbox', 'newsletter'],
  },
  {
    id: 'p6q7r8s9t0',
    name: 'David Green',
    email: 'david.g@example.com',
    avatar: 'https://picsum.photos/seed/avatar4/40/40',
    subject: 'Quick question about the meeting',
    text: 'Hi,\n\nI had a quick follow-up question regarding the marketing sync tomorrow. Could you clarify if we need to prepare a presentation? \n\nThanks,\nDavid',
    date: '2024-05-19T11:00:00',
    read: false,
    labels: ['inbox', 'work'],
  },
  {
    id: 'u1v2w3x4y5',
    name: 'Emily Brown',
    email: 'emily.b@example.com',
    avatar: 'https://picsum.photos/seed/avatar5/40/40',
    subject: 'Fwd: Vacation Photos!',
    text: "Hey everyone,\n\nSharing some photos from my trip! Hope you enjoy them.\n\nCheers,\nEmily",
    date: '2024-05-18T18:20:00',
    read: true,
    labels: ['inbox', 'personal'],
  },
  {
    id: 'z6a7b8c9d0',
    name: 'Frank Black',
    email: 'frank.b@example.com',
    avatar: 'https://picsum.photos/seed/avatar6/40/40',
    subject: 'Your account security alert',
    text: 'Dear Customer,\n\nA new sign-in to your account was detected from an unrecognized device. If this was you, you can safely ignore this email. If this was not you, please secure your account immediately.\n\nSincerely,\nSecurity Team',
    date: '2024-05-17T22:05:00',
    read: true,
    labels: ['inbox', 'important'],
  },
  {
    id: 'e1f2g3h4i5',
    name: 'SVARA Team',
    email: 'team@svara.com',
    avatar: 'https://picsum.photos/seed/reactmail/40/40',
    subject: 'Welcome to SVARA!',
    text: "Hello and welcome to SVARA!\n\nWe're thrilled to have you on board. SVARA is designed to be a clean, fast, and delightful email experience.\n\nHere are a few tips to get you started:\n- Use `Cmd/Ctrl + K` to open the command menu.\n- Customize your theme in the settings.\n- Organize your inbox with labels.\n\nIf you have any questions, feel free to reply to this email. We're here to help!\n\nHappy mailing,\nThe SVARA Team",
    date: '2024-05-16T12:00:00',
    read: false,
    labels: ['inbox', 'important'],
  },
  {
    id: 'j6k7l8m9n0',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    avatar: 'https://picsum.photos/seed/avatar1/40/40',
    subject: 'Re: Project Update & Next Steps',
    text: "Sounds good, I'll send over my feedback shortly.",
    date: '2024-05-20T11:00:00',
    read: true,
    labels: ['sent'],
  },
  {
    id: 'o1p2q3r4s5',
    name: 'Spam Bot',
    email: 'spam@example.com',
    avatar: 'https://picsum.photos/seed/spam/40/40',
    subject: 'You have won a prize!',
    text: 'Click here to claim your exclusive prize now!',
    date: '2024-05-18T05:00:00',
    read: true,
    labels: ['junk'],
  },
  {
    id: 't6u7v8w9x0',
    name: 'Old Newsletter',
    email: 'newsletter@example.com',
    avatar: 'https://picsum.photos/seed/oldnews/40/40',
    subject: 'This is an old newsletter',
    text: 'You have deleted this item.',
    date: '2024-04-10T14:00:00',
    read: true,
    labels: ['trash'],
  },
];
