import type { placeholderImages } from './placeholder-images.json';

export type Attachment = {
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  previewUrl?: string;
  size: string;
};
