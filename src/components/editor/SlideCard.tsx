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
      textShadow: '0 2px 8px rgba(0,0,0,0.9)',
    }),
  };

  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        'slide-thumbnail group relative animate-fade-in',
        isActive && 'active',
        isLive && 'live'
      )}
      aria-label={`Slide ${index + 1}: ${slide.content.lines.join(' ')}`}
      aria-pressed={isActive}
    >
      {/* Slide content */}
      <div
        className="w-full h-full flex items-center justify-center p-4"
        style={bgStyle}
      >
        <div className="text-center w-full" style={textStyle}>
          {slide.content.lines.map((line, i) => (
            <p key={i} className="text-[0.55rem] sm:text-[0.65rem] md:text-xs leading-snug">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Slide number badge */}
      <span className={cn(
        'absolute bottom-1.5 left-1.5 text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-md backdrop-blur-sm',
        isActive
          ? 'bg-brand-500/80 text-white'
          : 'bg-black/50 text-white/70'
      )}>
        {index + 1}
      </span>

      {/* Live indicator */}
      {isLive && (
        <span className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[0.5rem] font-bold bg-red-600/90 text-white px-2 py-0.5 rounded-md backdrop-blur-sm shadow-lg shadow-red-500/30">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-glow-pulse" />
          LIVE
        </span>
      )}

      {/* Active top accent */}
      {isActive && !isLive && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-400 via-brand-500 to-brand-400" />
      )}
      {isLive && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
      )}

      {/* Hover overlay with "play" hint */}
      <div className="absolute inset-0 flex items-center justify-center bg-brand-600/0 group-hover:bg-brand-600/10 transition-all duration-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200 scale-0 group-hover:scale-100">
          <svg className="w-3 h-3 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
