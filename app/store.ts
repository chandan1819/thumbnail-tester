import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Represents a single thumbnail with its associated file and metadata.
 */
interface Thumbnail {
  id: string;
  file: File;
  preview: string;
  title: string;
  channelName: string;
}

/**
 * Defines the state structure for the thumbnail store.
 */
interface ThumbnailState {
  /**
   * An array of the currently uploaded thumbnails.
   * @default []
   */
  thumbnails: Thumbnail[];
}

/**
 * Defines the actions available for manipulating the thumbnail state.
 */
interface ThumbnailActions {
  /**
   * Adds new files to the thumbnail list, creating unique IDs and default metadata.
   * @param files - An array of File objects to be added.
   */
  addThumbnails: (files: File[]) => void;
  /**
   * Removes a thumbnail from the list by its ID.
   * @param id - The unique ID of the thumbnail to remove.
   */
  removeThumbnail: (id: string) => void;
  /**
   * Updates the metadata (title or channelName) of a specific thumbnail.
   * @param id - The ID of the thumbnail to update.
   * @param metadata - An object containing the new title or channelName.
   */
  updateThumbnailMetadata: (id: string, metadata: Partial<Pick<Thumbnail, 'title' | 'channelName'>>) => void;
  /**
   * Randomly shuffles the order of the thumbnails in the list.
   */
  shuffleThumbnails: () => void;
  /**
   * Removes all thumbnails from the state, clearing the list.
   */
  clearThumbnails: () => void;
}

/**
 * Zustand store for managing thumbnail state and actions.
 * Combines state and actions into a single hook.
 * Uses Immer for simplified immutable state updates.
 */
export const useThumbnailStore = create<ThumbnailState & ThumbnailActions>()(
  immer((set) => ({
    thumbnails: [],

    addThumbnails: (files) => {
      const newThumbnails = files.map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        preview: URL.createObjectURL(file),
        title: 'Your Awesome Video Title',
        channelName: 'Your Channel',
      }));
      set((state) => {
        state.thumbnails.push(...newThumbnails);
        if (state.thumbnails.length > 3) {
          state.thumbnails.splice(0, state.thumbnails.length - 3);
        }
      });
    },

    removeThumbnail: (id) => {
      set((state) => {
        const index = state.thumbnails.findIndex((t: Thumbnail) => t.id === id);
        if (index !== -1) {
          state.thumbnails.splice(index, 1);
        }
      });
    },

    updateThumbnailMetadata: (id, metadata) => {
      set((state) => {
        const thumbnail = state.thumbnails.find((t: Thumbnail) => t.id === id);
        if (thumbnail) {
          if (metadata.title) thumbnail.title = metadata.title;
          if (metadata.channelName) thumbnail.channelName = metadata.channelName;
        }
      });
    },

    shuffleThumbnails: () => {
      set((state) => {
        for (let i = state.thumbnails.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [state.thumbnails[i], state.thumbnails[j]] = [state.thumbnails[j], state.thumbnails[i]];
        }
      });
    },
    
    clearThumbnails: () => {
      set((state) => {
        state.thumbnails = [];
      });
    },
  }))
); 