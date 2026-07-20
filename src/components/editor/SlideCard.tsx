'use client';

import { cn } from '@/lib/utils';
import type { Slide, Theme } from '@/types';

interface SlideCardProps {
  slide: Slide;
  theme: Theme | undefined;
  isActive: boolean;
  isLive: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  index: number;
}

export function SlideCard({ slide, theme, isActive, isLive, onClick, onDoubleClick, index }: SlideCardProps) {
  const bgStyle: React.CSSProperties = {
    backgroundColor: slide.background_color || theme?.background_color || '#000000',
    ...(slide.background_url && {
      backgroundImage: `url(${slide.background_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const textStyle: React.CSSProperties = {
    fontFamily: theme?.font_family || 'Inter',
    color: theme?.font_color || '#FFFFFF',
    fontWeight: theme?.font_weight || '700',
    textAlign: (theme?.text_align || 'center') as React.CSSProperties['textAlign'],
    ...(theme?.text_shadow && {
      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    }),
  };

  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        'slide-thumbnail group relative',
        isActive && 'active',
        isLive && 'border-red-500 ring-2 ring-red-500/30'
      )}
      aria-label={`Slide ${index + 1}: ${slide.content.lines.join(' ')}`}
      aria-pressed={isActive}
    >
      {/* Slide Preview */}
      <div
        className="w-full h-full flex items-center justify-center p-3"
        style={bgStyle}
      >
        <div className="text-center w-full" style={textStyle}>
          {slide.content.lines.map((line, i) => (
            <p key={i} className="text-[0.5rem] sm:text-[0.6rem] leading-tight">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Slide number badge */}
      <span className="absolute top-1 left-1 text-[0.5rem] bg-black/60 text-white/80 px-1 rounded">
        {index + 1}
      </span>

      {/* Live indicator */}
      {isLive && (
        <span className="absolute top-1 right-1 flex items-center gap-0.5 text-[0.5rem] bg-red-600 text-white px-1.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </span>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
    </button>
  );
}
