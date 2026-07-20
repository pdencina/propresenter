'use client';

import type { Slide, Theme } from '@/types';
import { Monitor, MonitorOff, Pencil, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlidePreviewProps {
  slide: Slide | null;
  theme: Theme | undefined;
  isLive: boolean;
  onGoLive: () => void;
  onClear: () => void;
  onEdit?: () => void;
}

export function SlidePreview({ slide, theme, isLive, onGoLive, onClear, onEdit }: SlidePreviewProps) {
  const bgStyle: React.CSSProperties = slide
    ? {
        backgroundColor: slide.background_color || theme?.background_color || '#000000',
        ...(slide.background_url && {
          backgroundImage: `url(${slide.background_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }
    : { backgroundColor: '#111' };

  const textStyle: React.CSSProperties = theme
    ? {
        fontFamily: theme.font_family,
        color: theme.font_color,
        fontWeight: theme.font_weight,
        textAlign: theme.text_align as React.CSSProperties['textAlign'],
        ...(theme.text_shadow && {
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }),
      }
    : { color: '#FFFFFF', fontWeight: '700', textAlign: 'center' as const };

  return (
    <div className="bg-surface-light/50 backdrop-blur-sm border-t border-white/[0.06]">
      {/* Controls bar */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isLive ? 'bg-red-500 animate-glow-pulse' : 'bg-white/20'
          )} />
          <span className="text-[0.65rem] font-semibold text-white/40 uppercase tracking-[0.12em]">
            Output
          </span>
        </div>

        <div className="flex gap-1.5">
          {slide && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]
                       text-white/50 hover:text-white text-[0.65rem] font-medium transition-all duration-200"
            >
              <Pencil className="w-3 h-3" />
              Editar
            </button>
          )}
          <button
            onClick={onGoLive}
            disabled={!slide}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.65rem] font-semibold transition-all duration-200',
              isLive
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/10'
                : 'bg-brand-600/20 text-brand-400 border border-brand-500/30 hover:bg-brand-600/30 hover:shadow-lg hover:shadow-brand-500/10',
              !slide && 'opacity-30 pointer-events-none'
            )}
          >
            <Zap className="w-3 h-3" />
            {isLive ? 'EN VIVO' : 'Go Live'}
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20
                     text-white/40 hover:text-red-400 text-[0.65rem] font-medium transition-all duration-200"
          >
            <MonitorOff className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex gap-4 p-4">
        {/* Main output preview */}
        <div className="flex-1">
          <div
            className={cn(
              'aspect-slide rounded-xl overflow-hidden flex items-center justify-center',
              'border transition-all duration-300',
              isLive
                ? 'border-red-500/40 shadow-xl shadow-red-500/10'
                : slide
                  ? 'border-white/[0.08] shadow-xl shadow-black/20'
                  : 'border-white/[0.04]'
            )}
            style={bgStyle}
          >
            {slide ? (
              <div className="p-6 w-full animate-fade-in" style={textStyle}>
                {slide.content.lines.map((line, i) => (
                  <p key={i} className="text-sm md:text-base lg:text-lg leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/20">
                <Monitor className="w-8 h-8" />
                <p className="text-xs">Selecciona un slide</p>
              </div>
            )}
          </div>

          {/* Notes below preview */}
          {slide?.notes && (
            <div className="mt-2 flex items-start gap-1.5 px-1">
              <span className="text-[0.55rem] font-bold text-amber-400/60 uppercase mt-0.5">Nota:</span>
              <p className="text-[0.7rem] text-white/40 italic">{slide.notes}</p>
            </div>
          )}
        </div>

        {/* Program output (what's live) indicator */}
        <div className="hidden lg:flex flex-col gap-2 w-32">
          <span className="text-[0.55rem] font-semibold text-white/30 uppercase tracking-wider text-center">
            Program
          </span>
          <div className={cn(
            'aspect-slide rounded-lg overflow-hidden flex items-center justify-center border',
            isLive
              ? 'border-red-500/30 bg-red-950/20'
              : 'border-white/[0.05] bg-black/40'
          )}>
            {isLive && slide ? (
              <div className="p-2 w-full text-center" style={textStyle}>
                {slide.content.lines.map((line, i) => (
                  <p key={i} className="text-[0.4rem] leading-tight">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <MonitorOff className="w-4 h-4 text-white/10" />
            )}
          </div>
          {isLive && (
            <div className="flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-glow-pulse" />
              <span className="text-[0.55rem] font-bold text-red-400">ON AIR</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
