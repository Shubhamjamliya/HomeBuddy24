import React, { memo, useRef } from 'react';
import { themeColors } from '../../../../theme';

const ServiceCard = memo(({ image, title, onClick, gif, youtubeUrl }) => {
  const cardRef = useRef(null);
  // ... (rest of the helper functions)
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    // Remove whitespace
    const cleanUrl = url.trim();
    // Handle YouTube Shorts: youtube.com/shorts/VIDEO_ID
    const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([^?&]+)/);
    if (shortsMatch) return shortsMatch[1];
    // Handle regular YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = youtubeUrl ? getYouTubeVideoId(youtubeUrl) : null;

  // Create embed URL with autoplay, loop, mute, and no controls (like a GIF)
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1`
    : null;

  return (
    <div
      ref={cardRef}
      className="relative min-w-[200px] md:min-w-[240px] h-[350px] md:h-[420px] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]"
      style={{
        boxShadow: themeColors.cardShadow,
        border: themeColors.cardBorder,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      onClick={onClick}
    >
      {youtubeUrl && embedUrl ? (
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
      ) : gif ? (
        <img
          src={gif}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
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
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white font-semibold text-base">{title}</h3>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;

