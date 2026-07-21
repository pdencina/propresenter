'use client';

import type { Slide, Theme } from '@/types';
import { SlideCard } from './SlideCard';
import { LayoutGrid } from 'lucide-react';

interface SlideGridProps {
  slides: Slide[];
  themes: Theme[];
  activeSlideId: string | null;
  liveSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
  onSlideDoubleClick?: () => void;
  gridColumns?: number;
}

export function SlideGrid({
  slides,
  themes,
  activeSlideId,
  liveSlideId,
  onSlideSelect,
  onSlideDoubleClick,
  gridColumns = 4,
}: SlideGridProps) {
  const getTheme = (themeId: string | null) =>
    themes.find((t) => t.id === themeId);

  if (slides.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
        <LayoutGrid className="w-10 h-10 text-white/10" />
        <p className="text-sm">Selecciona una sección para ver sus slides</p>
      </div>
    );
  }

  const gridClass =
    gridColumns === 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : gridColumns === 5
        ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5'
        : gridColumns === 6
          ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className={`grid ${gridClass} gap-4`}>
        {slides.map((slide, index) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            theme={getTheme(slide.theme_id)}
            isActive={slide.id === activeSlideId}
            isLive={slide.id === liveSlideId}
            onClick={() => onSlideSelect(slide.id)}
            onDoubleClick={() => {
              onSlideSelect(slide.id);
              onSlideDoubleClick?.();
            }}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
