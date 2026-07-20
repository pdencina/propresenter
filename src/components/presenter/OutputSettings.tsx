'use client';

import { cn } from '@/lib/utils';
import type { OutputConfig, OutputMode } from './PresenterView';
import { X, Monitor, Pipette } from 'lucide-react';

interface OutputSettingsProps {
  config: OutputConfig;
  onChange: (config: OutputConfig) => void;
  onClose: () => void;
}

const OUTPUT_MODES: { id: OutputMode; label: string; description: string; color: string }[] = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Fondo del slide (para proyección directa)',
    color: '#000000',
  },
  {
    id: 'chroma-green',
    label: 'Chroma Verde',
    description: 'Para key en Resolume / OBS / vMix',
    color: '#00FF00',
  },
  {
    id: 'chroma-blue',
    label: 'Chroma Azul',
    description: 'Alternativa para escenas con verde',
    color: '#0000FF',
  },
  {
    id: 'chroma-magenta',
    label: 'Chroma Magenta',
    description: 'Para NDI con alpha (algunos procesadores)',
    color: '#FF00FF',
  },
];

const RESOLUTION_PRESETS = [
  { label: '1920x1080 (Full HD)', width: 1920, height: 1080 },
  { label: '1280x720 (HD)', width: 1280, height: 720 },
  { label: '3840x2160 (4K)', width: 3840, height: 2160 },
  { label: '2560x1440 (2K)', width: 2560, height: 1440 },
  { label: '1920x1200 (WUXGA)', width: 1920, height: 1200 },
  { label: '1024x768 (XGA)', width: 1024, height: 768 },
  { label: '800x600 (SVGA)', width: 800, height: 600 },
  { label: '3840x1080 (Dual HD)', width: 3840, height: 1080 },
  { label: '5760x1080 (Triple HD)', width: 5760, height: 1080 },
];

export function OutputSettings({ config, onChange, onClose }: OutputSettingsProps) {
  const handleResolutionPreset = (width: number, height: number) => {
    onChange({ ...config, width, height });
  };

  const handleCustomWidth = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onChange({ ...config, width: num });
    }
  };

  const handleCustomHeight = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onChange({ ...config, height: num });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-surface-light rounded-2xl border border-white/10 shadow-2xl animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-semibold text-white">Configuración de Salida</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Output Mode */}
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
              Modo de Salida
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {OUTPUT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onChange({ ...config, mode: mode.id })}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all duration-200',
                    config.mode === mode.id
                      ? 'border-brand-500/50 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      className="w-5 h-5 rounded border border-white/20"
                      style={{ backgroundColor: mode.color }}
                    />
                    <span className={cn(
                      'text-sm font-medium',
                      config.mode === mode.id ? 'text-white' : 'text-white/70'
                    )}>
                      {mode.label}
                    </span>
                  </div>
                  <p className="text-[0.6rem] text-white/40 leading-relaxed pl-[1.9rem]">
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
              Resolución de Salida
            </h3>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {RESOLUTION_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleResolutionPreset(preset.width, preset.height)}
                  className={cn(
                    'px-2 py-1.5 rounded-lg text-[0.6rem] font-medium transition-all',
                    config.width === preset.width && config.height === preset.height
                      ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                      : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom resolution */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[0.6rem] text-white/40 block mb-1">Ancho (px)</label>
                <input
                  type="number"
                  value={config.width}
                  onChange={(e) => handleCustomWidth(e.target.value)}
                  min={320}
                  max={7680}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-white font-mono
                           border border-white/10 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <span className="text-white/30 mt-5">x</span>
              <div className="flex-1">
                <label className="text-[0.6rem] text-white/40 block mb-1">Alto (px)</label>
                <input
                  type="number"
                  value={config.height}
                  onChange={(e) => handleCustomHeight(e.target.value)}
                  min={240}
                  max={4320}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-white font-mono
                           border border-white/10 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* NDI / Capture info */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <h4 className="text-xs font-semibold text-white/60 mb-2">
              Conexión con Resolume / NDI
            </h4>
            <ol className="text-[0.65rem] text-white/40 space-y-1.5 list-decimal list-inside">
              <li>Abre esta ventana en el monitor secundario o en su propia ventana</li>
              <li>Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">F</kbd> para fullscreen</li>
              <li>En <strong className="text-white/60">NDI Screen Capture</strong>: selecciona esta ventana como fuente</li>
              <li>En <strong className="text-white/60">Resolume</strong>: agrega fuente NDI y aplica Chroma Key</li>
              <li>La salida de Resolume va al VDWall normalmente</li>
            </ol>
          </div>

          {/* Tips for chroma */}
          {config.mode !== 'normal' && (
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
              <h4 className="text-xs font-semibold text-emerald-400/80 mb-1.5">
                Tips para Chroma Key
              </h4>
              <ul className="text-[0.65rem] text-white/40 space-y-1 list-disc list-inside">
                <li>Text shadow desactivado automaticamente en modo chroma</li>
                <li>Usa fuentes bold/gruesas para mejor key</li>
                <li>En Resolume: Effect &gt; Chroma Key &gt; selecciona el color</li>
                <li>Ajusta similarity y smoothness para bordes limpios</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-[0.6rem] text-white/30">
            Atajos: <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/60 font-mono">F</kbd> Fullscreen
            <span className="mx-1.5">·</span>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/60 font-mono">S</kbd> Settings
          </p>
          <button
            onClick={onClose}
            className="btn-primary text-xs px-4 py-2"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
