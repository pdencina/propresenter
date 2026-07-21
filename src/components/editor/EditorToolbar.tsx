'use client';

import { useState, useEffect } from 'react';
import { Settings, Palette, LayoutGrid, Maximize, Minimize, Radio, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  serviceTitle: string;
  isConnected: boolean;
  onThemesClick: () => void;
  onLayoutClick: () => void;
  onFullscreenClick: () => void;
  onSettingsClick: () => void;
  isFullscreen: boolean;
  gridColumns: number;
}

export function EditorToolbar({
  serviceTitle,
  isConnected,
  onThemesClick,
  onLayoutClick,
  onFullscreenClick,
  onSettingsClick,
  isFullscreen,
  gridColumns,
}: EditorToolbarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 bg-surface-light/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 gap-3">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 pr-4 border-r border-white/10">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Radio className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs font-bold text-white/90 tracking-wide uppercase hidden sm:block">
          PasaLaLetra
        </span>
      </div>

      {/* Service title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-medium text-white/80 truncate">
          {serviceTitle}
        </h1>
      </div>

      {/* Clock */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-white/40 font-mono tabular-nums">
        <Clock className="w-3 h-3" />
        {time}
      </div>

      {/* Connection status pill */}
      <div className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-medium transition-all',
        isConnected
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-red-500/10 text-red-400 border border-red-500/20'
      )}>
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          isConnected ? 'bg-emerald-400 animate-glow-pulse' : 'bg-red-400'
        )} />
        {isConnected ? 'Live' : 'Offline'}
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-white/10" />

      {/* Action buttons */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onThemesClick}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all duration-200"
          aria-label="Temas"
          title="Temas"
        >
          <Palette className="w-4 h-4" />
        </button>
        <button
          onClick={onLayoutClick}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all duration-200 relative"
          aria-label={`Layout: ${gridColumns} columnas`}
          title={`Layout: ${gridColumns} columnas`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[0.45rem] font-bold text-brand-400 bg-surface rounded px-0.5">
            {gridColumns}
          </span>
        </button>
        <button
          onClick={onFullscreenClick}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all duration-200"
          aria-label={isFullscreen ? 'Salir de fullscreen' : 'Fullscreen'}
          title={isFullscreen ? 'Salir de fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all duration-200"
          aria-label="Configuración"
          title="Configuración"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
