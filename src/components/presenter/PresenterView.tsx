'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Slide, Theme } from '@/types';
import { cn } from '@/lib/utils';
import { mockService, mockThemes } from '@/lib/mock-data';
import { useRealtimePresentation } from '@/hooks/useRealtimePresentation';
import { Maximize, Minimize, Wifi, WifiOff, MonitorOff } from 'lucide-react';

interface PresenterViewProps {
  serviceId: string;
}

export function PresenterView({ serviceId }: PresenterViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Flatten all slides with their themes
  const allSlides = useMemo(() => {
    return mockService.sections.flatMap((section) =>
      section.slides.map((slide) => ({
        ...slide,
        sectionTitle: section.title,
        sectionType: section.type,
      }))
    );
  }, []);

  const { isConnected, currentSlideId, connectedUsers } = useRealtimePresentation({
    serviceId,
    role: 'presenter',
    userName: 'Presentador',
  });

  const activeSlide = useMemo(
    () => allSlides.find((s) => s.id === currentSlideId) || null,
    [allSlides, currentSlideId]
  );

  const activeTheme = useMemo(
    () =>
      mockThemes.find((t) => t.id === activeSlide?.theme_id) ||
      mockThemes.find((t) => t.is_default),
    [activeSlide?.theme_id]
  );

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Hide controls on inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    timeout = setTimeout(() => setShowControls(false), 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  const bgStyle: React.CSSProperties = activeSlide
    ? {
        backgroundColor:
          activeSlide.background_color || activeTheme?.background_color || '#000000',
        ...(activeSlide.background_url && {
          backgroundImage: `url(${activeSlide.background_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }
    : { backgroundColor: '#000000' };

  const textStyle: React.CSSProperties = activeTheme
    ? {
        fontFamily: activeTheme.font_family,
        fontSize: `${activeTheme.font_size}px`,
        color: activeTheme.font_color,
        fontWeight: activeTheme.font_weight,
        textAlign: activeTheme.text_align as React.CSSProperties['textAlign'],
        padding: activeTheme.padding,
        ...(activeTheme.text_shadow && {
          textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.6)',
        }),
      }
    : {
        color: '#FFFFFF',
        fontSize: '48px',
        fontWeight: '700',
        textAlign: 'center' as const,
        padding: '40px',
      };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={bgStyle}
    >
      {/* Main slide content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {activeSlide ? (
          <div className="w-full max-w-5xl" style={textStyle}>
            {activeSlide.content.lines.map((line, i) => (
              <p key={i} className="leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-gray-600">
            <MonitorOff className="w-16 h-16" />
            <p className="text-xl">Esperando slide...</p>
            <p className="text-sm text-gray-700">
              Presiona F para pantalla completa
            </p>
          </div>
        )}
      </div>

      {/* Controls overlay (auto-hides) */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 p-4 flex items-center justify-between transition-opacity duration-500',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Connection status */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md',
            isConnected
              ? 'bg-emerald-900/60 text-emerald-300'
              : 'bg-red-900/60 text-red-300'
          )}
        >
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          {isConnected
            ? `Conectado · ${connectedUsers.length} usuario${connectedUsers.length !== 1 ? 's' : ''}`
            : 'Desconectado'}
        </div>

        {/* Section info */}
        {activeSlide && (
          <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs text-gray-300">
            {activeSlide.sectionTitle}
          </div>
        )}

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-gray-300
                   hover:text-white hover:bg-black/60 transition-colors"
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
