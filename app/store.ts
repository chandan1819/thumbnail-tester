import { create } from 'zustand';

interface Thumbnail {
  id: string;
  file: File;
  preview: string;
  title: string;
  channelName: string;
}

interface ThumbnailState {
  thumbnails: Thumbnail[];
  addThumbnails: (files: File[]) => void;
  removeThumbnail: (id: string) => void;
  updateThumbnailMetadata: (id: string, metadata: Partial<Pick<Thumbnail, 'title' | 'channelName'>>) => void;
  shuffleThumbnails: () => void;
  clearThumbnails: () => void;
}

export const useThumbnailStore = create<ThumbnailState>((set) => ({
  thumbnails: [],
  addThumbnails: (files) => {
    const newThumbnails = files.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
      title: 'Your Awesome Video Title',
      channelName: 'Your Channel',
    }));
    set((state) => ({
      thumbnails: [...state.thumbnails, ...newThumbnails].slice(0, 3),
    }));
  },
  removeThumbnail: (id) => {
    set((state) => ({
      thumbnails: state.thumbnails.filter(t => t.id !== id),
    }));
  },
  updateThumbnailMetadata: (id, metadata) => {
    set((state) => ({
      thumbnails: state.thumbnails.map(t =>
        t.id === id ? { ...t, ...metadata } : t
      ),
    }));
  },
  shuffleThumbnails: () => {
    set((state) => {
      const array = [...state.thumbnails];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return { thumbnails: array };
    });
  },
  clearThumbnails: () => set({ thumbnails: [] }),
})); 