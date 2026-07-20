'use client';

import { Settings, Palette, Layout, Maximize, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  serviceTitle: string;
  isConnected: boolean;
}

export function EditorToolbar({ serviceTitle, isConnected }: EditorToolbarProps) {
  return (
    <header className="h-14 bg-surface-light border-b border-white/10 flex items-center px-4 gap-4">
      {/* Service title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">
          {serviceTitle}
        </h1>
      </div>

      {/* Connection status */}
      <div className={cn(
        'flex items-center gap-1.5 text-xs',
        isConnected ? 'text-emerald-400' : 'text-gray-500'
      )}>
        <Wifi className="w-3.5 h-3.5" />
        <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded hover:bg-surface-lighter text-gray-400 hover:text-white transition-colors"
          aria-label="Temas"
          title="Temas"
        >
          <Palette className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded hover:bg-surface-lighter text-gray-400 hover:text-white transition-colors"
          aria-label="Layout"
          title="Layout"
        >
          <Layout className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded hover:bg-surface-lighter text-gray-400 hover:text-white transition-colors"
          aria-label="Pantalla completa"
          title="Pantalla completa"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded hover:bg-surface-lighter text-gray-400 hover:text-white transition-colors"
          aria-label="Configuración"
          title="Configuración"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
