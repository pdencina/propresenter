'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Service, Slide, Theme } from '@/types';
import { ServiceSidebar } from './ServiceSidebar';
import { SlideGrid } from './SlideGrid';
import { SlidePreview } from './SlidePreview';
import { SlideEditor } from './SlideEditor';
import { ThemeEditor } from './ThemeEditor';
import { SettingsPanel } from './SettingsPanel';
import { EditorToolbar } from './EditorToolbar';

interface EditorLayoutProps {
  service: Service;
  themes: Theme[];
}

export function EditorLayout({ service: initialService, themes: initialThemes }: EditorLayoutProps) {
  const [service, setService] = useState(initialService);
  const [themes, setThemes] = useState(initialThemes);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    service.sections[0]?.id || null
  );
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [liveSlideId, setLiveSlideId] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gridColumns, setGridColumns] = useState(4);

  const activeSection = useMemo(
    () => service.sections.find((s) => s.id === activeSectionId) || null,
    [service.sections, activeSectionId]
  );

  const activeSlide = useMemo(() => {
    if (!activeSlideId || !activeSection) return null;
    return activeSection.slides.find((s) => s.id === activeSlideId) || null;
  }, [activeSection, activeSlideId]);

  const activeTheme = useMemo(
    () => themes.find((t) => t.id === activeSlide?.theme_id) || themes.find((t) => t.is_default),
    [themes, activeSlide?.theme_id]
  );

  // Fullscreen handling
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const cycleGridColumns = useCallback(() => {
    setGridColumns((prev) => {
      if (prev === 3) return 4;
      if (prev === 4) return 5;
      if (prev === 5) return 6;
      return 3;
    });
  }, []);

  const handleSectionSelect = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setActiveSlideId(null);
  };

  const handleSlideSelect = (slideId: string) => {
    setActiveSlideId(slideId);
  };

  const handleGoLive = () => {
    if (activeSlideId) {
      setLiveSlideId(activeSlideId);
    }
  };

  const handleClear = () => {
    setLiveSlideId(null);
  };

  const handleSlideDoubleClick = () => {
    if (activeSlideId) {
      setEditingSlide(true);
    }
  };

  const handleSlideUpdate = useCallback((slideId: string, updates: Partial<Slide>) => {
    setService((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        slides: section.slides.map((slide) =>
          slide.id === slideId ? { ...slide, ...updates } : slide
        ),
      })),
    }));
  }, []);

  const handleThemeSave = useCallback((themeData: Omit<Theme, 'id'> & { id?: string }) => {
    if (themeData.id) {
      // Update existing theme
      setThemes((prev) =>
        prev.map((t) => (t.id === themeData.id ? { ...t, ...themeData } as Theme : t))
      );
    } else {
      // Create new theme
      const newTheme: Theme = {
        ...themeData,
        id: `theme-${Date.now()}`,
      };
      setThemes((prev) => [...prev, newTheme]);
    }
    setShowThemeEditor(false);
  }, []);

  const sectionLabels: Record<string, string> = {
    song: 'Cancion',
    scripture: 'Escritura',
    announcement: 'Anuncio',
    media: 'Media',
    custom: 'Personalizado',
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface">
      <EditorToolbar
        serviceTitle={service.title}
        isConnected={true}
        onThemesClick={() => setShowThemeEditor(true)}
        onLayoutClick={cycleGridColumns}
        onFullscreenClick={toggleFullscreen}
        onSettingsClick={() => setShowSettings(true)}
        isFullscreen={isFullscreen}
        gridColumns={gridColumns}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ServiceSidebar
          sections={service.sections}
          activeSectionId={activeSectionId}
          onSectionSelect={handleSectionSelect}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Section header */}
          {activeSection && (
            <div className="px-5 py-3 border-b border-white/[0.06] bg-surface/80 backdrop-blur-sm flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white/90 truncate">{activeSection.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[0.6rem] font-medium text-white/30 uppercase tracking-wider">
                    {sectionLabels[activeSection.type] || activeSection.type}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[0.6rem] text-white/30">
                    {activeSection.slides.length} slide{activeSection.slides.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              {activeSlideId && (
                <span className="text-[0.6rem] font-mono text-white/20 bg-white/5 px-2 py-1 rounded-md">
                  {(activeSection.slides.findIndex(s => s.id === activeSlideId) + 1) || '-'} / {activeSection.slides.length}
                </span>
              )}
            </div>
          )}

          {/* Slide grid */}
          <SlideGrid
            slides={activeSection?.slides || []}
            themes={themes}
            activeSlideId={activeSlideId}
            liveSlideId={liveSlideId}
            onSlideSelect={handleSlideSelect}
            onSlideDoubleClick={handleSlideDoubleClick}
            gridColumns={gridColumns}
          />

          {/* Preview panel */}
          <SlidePreview
            slide={activeSlide}
            theme={activeTheme}
            isLive={liveSlideId === activeSlideId && activeSlideId !== null}
            onGoLive={handleGoLive}
            onClear={handleClear}
            onEdit={() => setEditingSlide(true)}
          />
        </div>
      </div>

      {/* Slide editor modal */}
      {editingSlide && activeSlide && (
        <SlideEditor
          slide={activeSlide}
          themes={themes}
          currentTheme={activeTheme}
          onSlideUpdate={handleSlideUpdate}
          onClose={() => setEditingSlide(false)}
        />
      )}

      {/* Theme editor modal */}
      {showThemeEditor && (
        <ThemeEditor
          onSave={handleThemeSave}
          onClose={() => setShowThemeEditor(false)}
        />
      )}

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          serviceTitle={service.title}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
