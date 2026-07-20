'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Slide, ServiceSection } from '@/types';
import { cn } from '@/lib/utils';
import { mockService, mockThemes } from '@/lib/mock-data';
import { useRealtimePresentation } from '@/hooks/useRealtimePresentation';
import {
  ChevronLeft,
  ChevronRight,
  MonitorOff,
  Wifi,
  WifiOff,
  Users,
  SkipForward,
  SkipBack,
} from 'lucide-react';

interface RemoteControlProps {
  serviceId: string;
}

interface FlatSlide extends Slide {
  sectionTitle: string;
  sectionType: ServiceSection['type'];
  globalIndex: number;
}

export function RemoteControl({ serviceId }: RemoteControlProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    mockService.sections[0]?.id || null
  );

  // Flatten all slides for sequential navigation
  const allSlides: FlatSlide[] = useMemo(() => {
    let globalIndex = 0;
    return mockService.sections.flatMap((section) =>
      section.slides.map((slide) => ({
        ...slide,
        sectionTitle: section.title,
        sectionType: section.type,
        globalIndex: globalIndex++,
      }))
    );
  }, []);

  const { isConnected, currentSlideId, connectedUsers, goToSlide, clearScreen } =
    useRealtimePresentation({
      serviceId,
      role: 'remote',
      userName: 'Control Remoto',
    });

  const currentIndex = useMemo(
    () => allSlides.findIndex((s) => s.id === currentSlideId),
    [allSlides, currentSlideId]
  );

  const currentSlide = currentIndex >= 0 ? allSlides[currentIndex] : null;
  const nextSlide = currentIndex >= 0 && currentIndex < allSlides.length - 1
    ? allSlides[currentIndex + 1]
    : null;

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(allSlides[currentIndex - 1].id);
    }
  }, [currentIndex, allSlides, goToSlide]);

  const handleNext = useCallback(() => {
    if (currentIndex < allSlides.length - 1) {
      goToSlide(allSlides[currentIndex + 1].id);
    } else if (currentIndex === -1 && allSlides.length > 0) {
      goToSlide(allSlides[0].id);
    }
  }, [currentIndex, allSlides, goToSlide]);

  const handlePreviousSection = useCallback(() => {
    if (!currentSlide) return;
    const currentSectionSlides = allSlides.filter(
      (s) => s.sectionTitle === currentSlide.sectionTitle
    );
    const firstOfCurrentSection = currentSectionSlides[0];
    
    // If already at first slide of section, go to previous section
    if (firstOfCurrentSection.globalIndex === currentIndex) {
      const prevSlide = currentIndex > 0 ? allSlides[currentIndex - 1] : null;
      if (prevSlide) {
        const prevSectionSlides = allSlides.filter(
          (s) => s.sectionTitle === prevSlide.sectionTitle
        );
        goToSlide(prevSectionSlides[0].id);
      }
    } else {
      goToSlide(firstOfCurrentSection.id);
    }
  }, [currentSlide, currentIndex, allSlides, goToSlide]);

  const handleNextSection = useCallback(() => {
    if (!currentSlide) {
      if (allSlides.length > 0) goToSlide(allSlides[0].id);
      return;
    }
    const currentSectionSlides = allSlides.filter(
      (s) => s.sectionTitle === currentSlide.sectionTitle
    );
    const lastOfCurrentSection = currentSectionSlides[currentSectionSlides.length - 1];
    const nextAfterSection = allSlides[lastOfCurrentSection.globalIndex + 1];
    if (nextAfterSection) {
      goToSlide(nextAfterSection.id);
    }
  }, [currentSlide, allSlides, goToSlide]);

  const getTheme = (themeId: string | null) =>
    mockThemes.find((t) => t.id === themeId) || mockThemes.find((t) => t.is_default);

  return (
    <div className="min-h-screen bg-surface flex flex-col safe-area-inset">
      {/* Header */}
      <header className="bg-surface-light border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white truncate">
              Control Remoto
            </h1>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {mockService.title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Users className="w-3.5 h-3.5" />
              {connectedUsers.length}
            </div>
            <div
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                isConnected
                  ? 'bg-emerald-900/40 text-emerald-400'
                  : 'bg-red-900/40 text-red-400'
              )}
            >
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {isConnected ? 'Live' : 'Offline'}
            </div>
          </div>
        </div>
      </header>

      {/* Current slide preview */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            En pantalla
          </span>
          {currentSlide && (
            <span className="text-xs text-gray-400">
              {currentIndex + 1} / {allSlides.length}
            </span>
          )}
        </div>

        <div
          className={cn(
            'aspect-slide rounded-xl overflow-hidden flex items-center justify-center border-2',
            currentSlide ? 'border-red-500/50' : 'border-white/10'
          )}
          style={{
            backgroundColor:
              currentSlide?.background_color ||
              getTheme(currentSlide?.theme_id || null)?.background_color ||
              '#000000',
          }}
        >
          {currentSlide ? (
            <div
              className="p-6 w-full text-center"
              style={{
                fontFamily: getTheme(currentSlide.theme_id)?.font_family || 'Inter',
                color: getTheme(currentSlide.theme_id)?.font_color || '#FFF',
                fontWeight: getTheme(currentSlide.theme_id)?.font_weight || '700',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {currentSlide.content.lines.map((line, i) => (
                <p key={i} className="text-sm md:text-lg leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-center">
              <MonitorOff className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Pantalla en negro</p>
            </div>
          )}
        </div>

        {/* Current section label */}
        {currentSlide && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {currentSlide.sectionTitle}
          </p>
        )}
      </div>

      {/* Large navigation buttons */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
            className="flex flex-col items-center justify-center py-5 rounded-xl
                     bg-surface-lighter hover:bg-surface-light active:bg-brand-600/30
                     disabled:opacity-30 disabled:pointer-events-none
                     transition-colors touch-manipulation"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
            <span className="text-xs text-gray-400 mt-1">Anterior</span>
          </button>

          <button
            onClick={clearScreen}
            className="flex flex-col items-center justify-center py-5 rounded-xl
                     bg-surface-lighter hover:bg-red-900/40 active:bg-red-700/40
                     transition-colors touch-manipulation"
            aria-label="Pantalla en negro"
          >
            <MonitorOff className="w-8 h-8 text-gray-300" />
            <span className="text-xs text-gray-400 mt-1">Negro</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= allSlides.length - 1 && currentIndex !== -1}
            className="flex flex-col items-center justify-center py-5 rounded-xl
                     bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                     disabled:opacity-30 disabled:pointer-events-none
                     transition-colors touch-manipulation"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-8 h-8 text-white" />
            <span className="text-xs text-white/80 mt-1">Siguiente</span>
          </button>
        </div>

        {/* Section jump buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={handlePreviousSection}
            disabled={!currentSlide || currentIndex === 0}
            className="flex items-center justify-center gap-2 py-3 rounded-xl
                     bg-surface-lighter hover:bg-surface-light active:bg-brand-600/30
                     disabled:opacity-30 disabled:pointer-events-none
                     transition-colors touch-manipulation"
            aria-label="Sección anterior"
          >
            <SkipBack className="w-5 h-5 text-gray-300" />
            <span className="text-xs text-gray-300">Sección ant.</span>
          </button>
          <button
            onClick={handleNextSection}
            className="flex items-center justify-center gap-2 py-3 rounded-xl
                     bg-surface-lighter hover:bg-surface-light active:bg-brand-600/30
                     disabled:opacity-30 disabled:pointer-events-none
                     transition-colors touch-manipulation"
            aria-label="Siguiente sección"
          >
            <span className="text-xs text-gray-300">Sección sig.</span>
            <SkipForward className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Next slide preview */}
      {nextSlide && (
        <div className="px-4 pb-3">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-2">
            Siguiente
          </span>
          <button
            onClick={() => goToSlide(nextSlide.id)}
            className="w-full aspect-[21/9] rounded-lg overflow-hidden flex items-center justify-center
                     border border-white/10 hover:border-brand-500/50 transition-colors
                     touch-manipulation"
            style={{
              backgroundColor:
                nextSlide.background_color ||
                getTheme(nextSlide.theme_id)?.background_color ||
                '#000',
            }}
          >
            <div
              className="p-4 w-full text-center"
              style={{
                fontFamily: getTheme(nextSlide.theme_id)?.font_family || 'Inter',
                color: getTheme(nextSlide.theme_id)?.font_color || '#FFF',
                fontWeight: getTheme(nextSlide.theme_id)?.font_weight || '700',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {nextSlide.content.lines.map((line, i) => (
                <p key={i} className="text-xs leading-tight opacity-80">
                  {line}
                </p>
              ))}
            </div>
          </button>
        </div>
      )}

      {/* Section list (collapsible) */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mb-2">
          Secciones
        </span>
        <div className="space-y-2">
          {mockService.sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const sectionHasActiveSlide = section.slides.some(
              (s) => s.id === currentSlideId
            );

            return (
              <div key={section.id} className="rounded-xl overflow-hidden bg-surface-lighter">
                <button
                  onClick={() =>
                    setExpandedSection(isExpanded ? null : section.id)
                  }
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-left transition-colors touch-manipulation',
                    sectionHasActiveSlide && 'bg-brand-600/10'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {sectionHasActiveSlide && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-white truncate">
                      {section.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {section.slides.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-2 pb-2 grid grid-cols-2 gap-2">
                    {section.slides.map((slide, idx) => {
                      const isActive = slide.id === currentSlideId;
                      const theme = getTheme(slide.theme_id);

                      return (
                        <button
                          key={slide.id}
                          onClick={() => goToSlide(slide.id)}
                          className={cn(
                            'aspect-slide rounded-lg overflow-hidden flex items-center justify-center',
                            'border-2 transition-all touch-manipulation active:scale-95',
                            isActive
                              ? 'border-red-500 ring-2 ring-red-500/30'
                              : 'border-transparent hover:border-brand-500/50'
                          )}
                          style={{
                            backgroundColor:
                              slide.background_color || theme?.background_color || '#000',
                          }}
                        >
                          <div
                            className="p-2 w-full text-center"
                            style={{
                              color: theme?.font_color || '#FFF',
                              fontFamily: theme?.font_family || 'Inter',
                              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                            }}
                          >
                            {slide.content.lines.map((line, i) => (
                              <p key={i} className="text-[0.5rem] leading-tight truncate">
                                {line}
                              </p>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
