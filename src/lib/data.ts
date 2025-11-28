import type { placeholderImages } from './placeholder-images.json';

export type Attachment = {
  id:string;
  filename:string;
  content_type:string;
  name?: string;
  type?: 'image' | 'video' | 'audio' | 'file';
  url?: string;
  previewUrl?: string;
  size?: string;
};
