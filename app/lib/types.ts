export type ViewMode = 'desktop' | 'mobile' | 'search' | 'sidebar';

export interface Video {
  id?: string;
  thumbnailUrl: string;
  channelIconUrl: string;
  title: string;
  channelName: string;
  views: string;
  timestamp: string;
  isUserUploaded?: boolean;
  fileName?: string;
} 