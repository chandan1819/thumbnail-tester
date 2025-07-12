'use client';

import { useUserAgent } from 'next-useragent';
import { useEffect, useState } from 'react';

const DeviceInfo = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const ua = useUserAgent(typeof window !== 'undefined' ? window.navigator.userAgent : '');

  if (!isClient) {
    return null;
  }

  const deviceType = ua.isMobile ? 'Mobile' : 'Desktop';
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm">
      <p>
        Device Type: <span className="font-bold capitalize">{deviceType}</span>
      </p>
    </div>
  );
};

export default DeviceInfo; 