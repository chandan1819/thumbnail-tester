import Image from 'next/image';
import { ViewMode, Video } from '../lib/types';
import { useThumbnailStore } from '../store';

interface VideoCardProps {
  video: Video;
  viewMode: ViewMode;
  onRemove: (id: string | undefined) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  viewMode,
  onRemove,
}) => {
  const { updateThumbnailMetadata } = useThumbnailStore();

  const {
    id,
    thumbnailUrl,
    channelIconUrl,
    title,
    channelName,
    views,
    timestamp,
    isUserUploaded,
    fileName,
  } = video;

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (id) {
      updateThumbnailMetadata(id, { [e.target.name]: e.target.value });
    }
  };


  const renderDesktop = () => (
    <div className="flex flex-col space-y-2">
      <Image
        src={thumbnailUrl}
        alt={title}
        width={1280}
        height={720}
        className="w-full h-auto rounded-xl"
      />
      <div className="flex items-start space-x-3">
        <Image
          src={channelIconUrl}
          alt={channelName}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex flex-col flex-grow">
          {isUserUploaded ? (
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleMetadataChange}
              className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-base font-semibold"
              placeholder="Video title"
            />
          ) : (
            <h3 className="font-semibold text-base leading-snug">{title}</h3>
          )}
          {isUserUploaded ? (
            <input
              type="text"
              name="channelName"
              value={channelName}
              onChange={handleMetadataChange}
              className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-sm mt-1"
              placeholder="Channel name"
            />
          ) : (
            <p className="text-sm text-gray-500">{channelName}</p>
          )}
          <div className="flex items-center space-x-1">
            <p className="text-sm text-gray-500">{views}</p>
            <span className="text-sm text-gray-500">•</span>
            <p className="text-sm text-gray-500">{timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (viewMode === 'search') {
    return (
      <div className="relative flex space-x-4">
        <div className="w-1/3">
          <Image
            src={thumbnailUrl}
            alt={title}
            width={1280}
            height={720}
            className="w-full h-auto rounded-xl"
          />
        </div>
        <div className="w-2/3 flex flex-col">
          {isUserUploaded ? (
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleMetadataChange}
              className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-xl font-normal"
              placeholder="Video title"
            />
          ) : (
            <h3 className="font-normal text-xl leading-snug">{title}</h3>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <p>{views}</p>
            <span>•</span>
            <p>{timestamp}</p>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Image src={channelIconUrl} alt={channelName} width={24} height={24} className="rounded-full" />
            {isUserUploaded ? (
              <input
                type="text"
                name="channelName"
                value={channelName}
                onChange={handleMetadataChange}
                className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Channel name"
              />
            ) : (
              <p className="text-sm text-gray-500">{channelName}</p>
            )}
          </div>
        </div>
        {isUserUploaded && (
          <button
            onClick={() => onRemove(id)}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'sidebar') {
    return (
      <div className="relative flex space-x-2">
        <div className="w-1/2">
          <Image
            src={thumbnailUrl}
            alt={title}
            width={1280}
            height={720}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-1/2 flex flex-col">
           {isUserUploaded ? (
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleMetadataChange}
              className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-sm font-semibold"
              placeholder="Video title"
            />
          ) : (
            <h3 className="font-semibold text-sm leading-snug">{title}</h3>
          )}
          {isUserUploaded ? (
            <input
              type="text"
              name="channelName"
              value={channelName}
              onChange={handleMetadataChange}
              className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-xs mt-1"
              placeholder="Channel name"
            />
          ) : (
            <p className="text-xs text-gray-500">{channelName}</p>
          )}
          <div className="flex items-center space-x-1">
            <p className="text-xs text-gray-500">{views}</p>
            <span className="text-xs text-gray-500">•</span>
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
        </div>
         {isUserUploaded && (
          <button
            onClick={() => onRemove(id)}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'mobile') {
    return (
      <div className="relative flex flex-col space-y-2">
        <Image
          src={thumbnailUrl}
          alt={title}
          width={1280}
          height={720}
          className="w-full h-auto rounded-none" // Mobile has no rounded corners on feed
        />
        <div className="flex items-start space-x-3 p-3">
          <Image
            src={channelIconUrl}
            alt={channelName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col flex-grow">
            {isUserUploaded ? (
              <input
                type="text"
                name="title"
                value={title}
                onChange={handleMetadataChange}
                className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-base font-normal"
                placeholder="Video title"
              />
            ) : (
              <h3 className="font-normal text-base leading-snug">{title}</h3>
            )}
            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
              {isUserUploaded ? (
                <input
                  type="text"
                  name="channelName"
                  value={channelName}
                  onChange={handleMetadataChange}
                  className="bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Channel name"
                />
              ) : (
                <p>{channelName}</p>
              )}
              <span>•</span>
              <p>{views}</p>
              <span>•</span>
              <p>{timestamp}</p>
            </div>
          </div>
        </div>
        {isUserUploaded && (
          <button
            onClick={() => onRemove(id)}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {renderDesktop()}
      {isUserUploaded && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
        >
          ✕
        </button>
      )}
    </div>
  );
}; 