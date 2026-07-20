'use client';

import { useState } from 'react';
import type { Theme } from '@/types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ThemeEditorProps {
  theme?: Theme;
  onSave: (theme: Omit<Theme, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const fontFamilies = ['Inter', 'Georgia', 'Roboto', 'Montserrat', 'Playfair Display', 'Oswald'];
const fontWeights = ['400', '500', '600', '700', '800', '900'];

export function ThemeEditor({ theme, onSave, onClose }: ThemeEditorProps) {
  const [name, setName] = useState(theme?.name || '');
  const [fontFamily, setFontFamily] = useState(theme?.font_family || 'Inter');
  const [fontSize, setFontSize] = useState(theme?.font_size || 48);
  const [fontColor, setFontColor] = useState(theme?.font_color || '#FFFFFF');
  const [fontWeight, setFontWeight] = useState(theme?.font_weight || '700');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(theme?.text_align || 'center');
  const [textShadow, setTextShadow] = useState(theme?.text_shadow ?? true);
  const [backgroundColor, setBackgroundColor] = useState(theme?.background_color || '#000000');
  const [padding, setPadding] = useState(theme?.padding || '40px');

  const handleSubmit = () => {
    onSave({
      ...(theme?.id && { id: theme.id }),
      name,
      font_family: fontFamily,
      font_size: fontSize,
      font_color: fontColor,
      font_weight: fontWeight,
      text_align: textAlign,
      text_shadow: textShadow,
      background_color: backgroundColor,
      background_image_url: theme?.background_image_url || null,
      padding,
      is_default: theme?.is_default || false,
    });
  };

  const previewStyle: React.CSSProperties = {
    fontFamily,
    fontSize: `${Math.min(fontSize, 36)}px`,
    color: fontColor,
    fontWeight,
    textAlign,
    ...(textShadow && { textShadow: '0 2px 12px rgba(0,0,0,0.9)' }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-surface-light rounded-xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            {theme ? 'Editar Tema' : 'Nuevo Tema'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-surface-lighter text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          <div
            className="aspect-slide max-h-40 rounded-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: backgroundColor || '#000' }}
          >
            <p style={previewStyle}>Texto de ejemplo</p>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Nombre del tema</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi tema personalizado"
                className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-white border border-white/10
                         focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Fuente</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-white border border-white/10
                         focus:border-brand-500 focus:outline-none"
              >
                {fontFamilies.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Tamaño ({fontSize}px)</label>
              <input
                type="range"
                min={24}
                max={96}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Peso</label>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-white border border-white/10
                         focus:border-brand-500 focus:outline-none"
              >
                {fontWeights.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Alineación</label>
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => setTextAlign(align)}
                    className={cn(
                      'flex-1 py-2 text-sm transition-colors',
                      textAlign === align ? 'bg-brand-600 text-white' : 'bg-surface text-gray-400 hover:text-white'
                    )}
                  >
                    {align === 'left' && 'Izq'}
                    {align === 'center' && 'Centro'}
                    {align === 'right' && 'Der'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Color texto</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer bg-transparent border border-white/10"
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm text-white font-mono border border-white/10 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Color fondo</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor || '#000000'}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer bg-transparent border border-white/10"
                />
                <input
                  type="text"
                  value={backgroundColor || '#000000'}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm text-white font-mono border border-white/10 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={textShadow}
                  onChange={(e) => setTextShadow(e.target.checked)}
                  className="rounded border-white/10 bg-surface text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-300">Sombra de texto</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              {theme ? 'Guardar cambios' : 'Crear tema'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
