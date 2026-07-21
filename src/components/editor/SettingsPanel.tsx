'use client';

import { X, Info } from 'lucide-react';

interface SettingsPanelProps {
  serviceTitle: string;
  onClose: () => void;
}

export function SettingsPanel({ serviceTitle, onClose }: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-surface-light rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white">Configuración</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Service info */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-2">
              Servicio actual
            </label>
            <p className="text-sm text-white/80">{serviceTitle}</p>
          </div>

          {/* Shortcuts reference */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-2">
              Atajos de teclado
            </label>
            <div className="space-y-1.5">
              {[
                { key: 'Doble click', action: 'Editar slide' },
                { key: 'Esc', action: 'Cerrar modales' },
              ].map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{action}</span>
                  <kbd className="text-[0.6rem] px-2 py-0.5 rounded bg-white/5 text-white/60 font-mono border border-white/10">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* App info */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-white/60">
                PasaLaLetra v0.1.0
              </p>
              <p className="text-[0.6rem] text-white/30 mt-0.5">
                Conecta Supabase para sincronización en tiempo real entre Editor, Presentador y Control Remoto.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs px-4 py-2">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
