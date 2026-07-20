'use client';

import type { Slide, Theme } from '@/types';
import { Monitor, MonitorOff, Pencil } from 'lucide-react';
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
    : { backgroundColor: '#000000' };

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
    <div className="bg-surface-light border-t border-white/10 p-4">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex-1">
          Preview
        </h3>
        <div className="flex gap-2">
          {slide && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-lighter
                       text-gray-300 hover:text-white hover:bg-brand-600 text-xs font-medium transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
          )}
          <button
            onClick={onGoLive}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
              isLive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-surface-lighter text-gray-300 hover:bg-brand-600 hover:text-white'
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            {isLive ? 'EN VIVO' : 'Go Live'}
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-lighter
                     text-gray-400 hover:text-white text-xs font-medium transition-colors"
          >
            <MonitorOff className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Preview canvas */}
      <div
        className="aspect-slide rounded-lg overflow-hidden flex items-center justify-center max-h-48"
        style={bgStyle}
      >
        {slide ? (
          <div className="p-6 w-full" style={textStyle}>
            {slide.content.lines.map((line, i) => (
              <p key={i} className="text-base md:text-lg lg:text-xl leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">Ningún slide seleccionado</p>
        )}
      </div>

      {/* Notes */}
      {slide?.notes && (
        <p className="mt-2 text-xs text-gray-500 italic">{slide.notes}</p>
      )}
    </div>
  );
}
