"use client";

import { useThumbnailStore } from '../store';
import { VideoCard } from '../components/VideoCard';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dummyData } from '../lib/dummy-data';
import { ViewMode } from '../lib/types';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export default function TestingPage() {
  const { thumbnails, removeThumbnail, shuffleThumbnails } = useThumbnailStore();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const router = useRouter();

  const handleRemoveThumbnail = (id: string | undefined) => {
    if (id) {
      removeThumbnail(id);
      if (thumbnails.length - 1 === 0) {
        router.push('/');
      }
    }
  };

  const combinedVideos = useMemo(() => {
    const userUploadedVideos = thumbnails.map((thumbnail) => ({
      ...dummyData[thumbnails.indexOf(thumbnail) % dummyData.length],
      id: thumbnail.id,
      thumbnailUrl: thumbnail.preview,
      title: thumbnail.title,
      channelName: thumbnail.channelName,
      isUserUploaded: true,
      fileName: thumbnail.file.name,
    }));

    const dummyDataFiltered = dummyData.slice(thumbnails.length);

    return [...userUploadedVideos, ...dummyDataFiltered];
  }, [thumbnails]);


  if (thumbnails.length === 0) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const getGridCols = () => {
    switch (viewMode) {
      case 'desktop':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 'mobile':
        return 'grid-cols-1';
      case 'search':
        return 'grid-cols-1';
      case 'sidebar':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };


  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">YouTube {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Feed</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">View Mode:</span>
              {(['desktop', 'mobile', 'search', 'sidebar'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={shuffleThumbnails}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
            >
              Shuffle Thumbnails
            </button>
            <ThemeSwitcher />
          </div>
        </div>

        <div className={`grid ${getGridCols()} gap-x-4 gap-y-8`}>
          {combinedVideos.map((video) => (
            <VideoCard key={video.id} video={video} viewMode={viewMode} onRemove={handleRemoveThumbnail} />
          ))}
        </div>
      </div>
    </div>
  );
} 