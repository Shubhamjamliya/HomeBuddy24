import React, { memo, useRef } from 'react';
import { themeColors } from '../../../../theme';
import OptimizedImage from '../../../../components/common/OptimizedImage';
import OptimizedVideo from '../../../../components/common/OptimizedVideo';

const ServiceCard = memo(({ image, title, onClick, gif, youtubeUrl }) => {
  const cardRef = useRef(null);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([^?&]+)/);
    if (shortsMatch) return shortsMatch[1];
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = youtubeUrl ? getYouTubeVideoId(youtubeUrl) : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1`
    : null;

  const isCloudinaryVideo = (url) => {
    if (!url) return false;
    return url.includes('video/upload') || url.match(/\.(mp4|webm|ogg|mov)$|^https:\/\/res\.cloudinary\.com.*\/video\//i);
  };

  const renderMedia = () => {
    if (youtubeUrl && embedUrl) {
      return (
        <div className="relative w-full h-full">
          <iframe
            src={embedUrl}
            className="w-full h-full object-cover pointer-events-none"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            title={title}
          />
        </div>
      );
    }

    const mediaUrl = gif || image;
    if (isCloudinaryVideo(mediaUrl)) {
      return (
        <OptimizedVideo
          src={mediaUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      );
    }

    if (mediaUrl) {
      return (
        <OptimizedImage
          src={mediaUrl}
          alt={title}
          className="w-full h-full object-cover"
          width={480}
        />
      );
    }

    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className="relative min-w-[220px] h-[340px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 ease-out group shadow-sm hover:shadow-xl translate-z-0"
      onClick={onClick}
    >
      {renderMedia()}

      {/* Premium Glassmorphism Overlay */}
      <div className="absolute inset-x-3 bottom-3 p-4 bg-white/20 backdrop-blur-md rounded-[20px] border border-white/30 transition-all duration-300 group-hover:inset-x-2 group-hover:bottom-2">
        <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow-sm">{title}</h3>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
