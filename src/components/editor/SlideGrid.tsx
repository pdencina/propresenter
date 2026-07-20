'use client';

import type { Slide, Theme } from '@/types';
import { SlideCard } from './SlideCard';

interface SlideGridProps {
  slides: Slide[];
  themes: Theme[];
  activeSlideId: string | null;
  liveSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
  onSlideDoubleClick?: () => void;
}

export function SlideGrid({
  slides,
  themes,
  activeSlideId,
  liveSlideId,
  onSlideSelect,
  onSlideDoubleClick,
}: SlideGridProps) {
  const getTheme = (themeId: string | null) =>
    themes.find((t) => t.id === themeId);

  if (slides.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Selecciona una sección para ver sus slides</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
