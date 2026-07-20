'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Slide, Theme } from '@/types';
import { cn } from '@/lib/utils';
import { mockService, mockThemes } from '@/lib/mock-data';
import { useRealtimePresentation } from '@/hooks/useRealtimePresentation';
import { OutputSettings } from './OutputSettings';
import { Maximize, Minimize, Wifi, WifiOff, MonitorOff, Settings2 } from 'lucide-react';

export type OutputMode = 'normal' | 'chroma-green' | 'chroma-blue' | 'chroma-magenta' | 'transparent';

export interface OutputConfig {
  mode: OutputMode;
  width: number;
  height: number;
  customChromaColor: string;
}

const CHROMA_COLORS: Record<OutputMode, string> = {
  'normal': '#000000',
  'chroma-green': '#00FF00',
  'chroma-blue': '#0000FF',
  'chroma-magenta': '#FF00FF',
  'transparent': '#000000',
};

interface PresenterViewProps {
  serviceId: string;
}

export function PresenterView({ serviceId }: PresenterViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [outputConfig, setOutputConfig] = useState<OutputConfig>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('presenter-output-config');
      if (saved) return JSON.parse(saved);
    }
    return { mode: 'normal', width: 1920, height: 1080, customChromaColor: '#00FF00' };
  });

  // Persist config
  useEffect(() => {
    localStorage.setItem('presenter-output-config', JSON.stringify(outputConfig));
  }, [outputConfig]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
        return;
      }
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
      if (e.key === 'f' || e.key === 'F') {
        if (!showSettings) toggleFullscreen();
      }
      if (e.key === 's' || e.key === 'S') {
        setShowSettings((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen, showSettings]);

  // Determine background
  const getBackground = (): React.CSSProperties => {
    const isChroma = outputConfig.mode !== 'normal';
    
    if (!activeSlide) {
      // No slide = show chroma or black
      return {
        backgroundColor: isChroma ? CHROMA_COLORS[outputConfig.mode] : '#000000',
      };
    }

    if (isChroma) {
      // In chroma mode, always show chroma color as background (text only, no slide bg)
      return {
        backgroundColor: CHROMA_COLORS[outputConfig.mode],
      };
    }

    // Normal mode - show slide background
    return {
      backgroundColor: activeSlide.background_color || activeTheme?.background_color || '#000000',
      ...(activeSlide.background_url && {
        backgroundImage: `url(${activeSlide.background_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }),
    };
  };

  const textStyle: React.CSSProperties = activeTheme
    ? {
        fontFamily: activeTheme.font_family,
        fontSize: `${activeTheme.font_size}px`,
        color: activeTheme.font_color,
        fontWeight: activeTheme.font_weight,
        textAlign: activeTheme.text_align as React.CSSProperties['textAlign'],
        padding: activeTheme.padding,
        ...(activeTheme.text_shadow && outputConfig.mode === 'normal' && {
          textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.6)',
        }),
        // In chroma mode, use a clean outline shadow for readability without bleeding
        ...(activeTheme.text_shadow && outputConfig.mode !== 'normal' && {
          textShadow: '0 0 2px rgba(0,0,0,0.3)',
        }),
      }
    : {
        color: '#FFFFFF',
        fontSize: '48px',
        fontWeight: '700',
        textAlign: 'center' as const,
        padding: '40px',
      };

  // Resolution style for the container
  const resolutionStyle: React.CSSProperties = isFullscreen
    ? { width: '100vw', height: '100vh' }
    : { width: `${outputConfig.width}px`, height: `${outputConfig.height}px`, maxWidth: '100vw', maxHeight: '100vh' };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Output canvas */}
      <div
        className="relative overflow-hidden select-none"
        style={{ ...resolutionStyle, ...getBackground() }}
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
            // In chroma mode, show nothing when no slide (clean chroma)
            outputConfig.mode === 'normal' && (
              <div className="flex flex-col items-center gap-4 text-gray-600">
                <MonitorOff className="w-16 h-16" />
                <p className="text-xl">Esperando slide...</p>
                <p className="text-sm text-gray-700">
                  F = Fullscreen · S = Settings
                </p>
              </div>
            )
          )}
        </div>

        {/* Mode indicator badge (only in chroma modes) */}
        {outputConfig.mode !== 'normal' && showControls && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-xs font-medium text-white/80">
            Chroma: {outputConfig.mode === 'chroma-green' && 'Verde'}
            {outputConfig.mode === 'chroma-blue' && 'Azul'}
            {outputConfig.mode === 'chroma-magenta' && 'Magenta'}
            {outputConfig.mode === 'transparent' && 'Negro (Alpha)'}
          </div>
        )}

        {/* Resolution indicator */}
        {showControls && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-white/60">
            {outputConfig.width}x{outputConfig.height}
          </div>
        )}

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

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-gray-300
                       hover:text-white hover:bg-black/60 transition-colors"
              aria-label="Configuración de salida"
              title="Configuración (S)"
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-gray-300
                       hover:text-white hover:bg-black/60 transition-colors"
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              title="Fullscreen (F)"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <OutputSettings
          config={outputConfig}
          onChange={setOutputConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
