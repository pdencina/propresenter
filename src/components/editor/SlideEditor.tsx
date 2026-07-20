'use client';

import { useState, useCallback } from 'react';
import type { Slide, Theme } from '@/types';
import { cn } from '@/lib/utils';
import { Type, Image, Palette, AlignLeft, AlignCenter, AlignRight, Plus, Trash2 } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  themes: Theme[];
  currentTheme: Theme | undefined;
  onSlideUpdate: (slideId: string, updates: Partial<Slide>) => void;
  onClose: () => void;
}

export function SlideEditor({
  slide,
  themes,
  currentTheme,
  onSlideUpdate,
  onClose,
}: SlideEditorProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'background' | 'theme'>('text');
  const [lines, setLines] = useState<string[]>(slide.content.lines);

  const handleLineChange = useCallback((index: number, value: string) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
    onSlideUpdate(slide.id, { content: { lines: newLines } });
  }, [lines, onSlideUpdate, slide.id]);

  const handleAddLine = useCallback(() => {
    const newLines = [...lines, ''];
    setLines(newLines);
    onSlideUpdate(slide.id, { content: { lines: newLines } });
  }, [lines, onSlideUpdate, slide.id]);

  const handleRemoveLine = useCallback((index: number) => {
    const newLines = lines.filter((_, i) => i !== index);
    setLines(newLines);
    onSlideUpdate(slide.id, { content: { lines: newLines } });
  }, [lines, onSlideUpdate, slide.id]);

  const handleBackgroundColorChange = useCallback((color: string) => {
    onSlideUpdate(slide.id, { background_color: color });
  }, [onSlideUpdate, slide.id]);

  const handleThemeSelect = useCallback((themeId: string) => {
    onSlideUpdate(slide.id, { theme_id: themeId });
  }, [onSlideUpdate, slide.id]);

  const bgStyle: React.CSSProperties = {
    backgroundColor: slide.background_color || currentTheme?.background_color || '#000000',
  };

  const textStyle: React.CSSProperties = currentTheme
    ? {
        fontFamily: currentTheme.font_family,
        color: currentTheme.font_color,
        fontWeight: currentTheme.font_weight,
        textAlign: currentTheme.text_align as React.CSSProperties['textAlign'],
        ...(currentTheme.text_shadow && {
          textShadow: '0 2px 12px rgba(0,0,0,0.9)',
        }),
      }
    : { color: '#FFFFFF', fontWeight: '700', textAlign: 'center' as const };

  const tabs = [
    { id: 'text' as const, label: 'Texto', icon: Type },
    { id: 'background' as const, label: 'Fondo', icon: Image },
    { id: 'theme' as const, label: 'Tema', icon: Palette },
  ];

  const presetColors = [
    '#000000', '#1a1a2e', '#16213e', '#1e3a5f',
    '#0f3460', '#533483', '#4a1942', '#2d132c',
    '#1a1a2e', '#2c3e50', '#1b4332', '#3d0000',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 bg-surface-light rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Editar Slide</h2>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-surface-lighter hover:bg-brand-600 text-sm
                     text-gray-300 hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>

        <div className="flex h-[500px]">
          {/* Live preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-surface">
            <div
              className="aspect-slide w-full max-w-lg rounded-lg overflow-hidden flex items-center justify-center shadow-xl"
              style={bgStyle}
            >
              <div className="p-8 w-full" style={textStyle}>
                {lines.map((line, i) => (
                  <p key={i} className="text-lg md:text-2xl leading-relaxed">
                    {line || <span className="text-gray-600 italic">Línea vacía</span>}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Editor panel */}
          <div className="w-80 border-l border-white/10 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors',
                      activeTab === tab.id
                        ? 'text-brand-400 border-b-2 border-brand-400'
                        : 'text-gray-500 hover:text-gray-300'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'text' && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Líneas de texto
                  </label>
                  {lines.map((line, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => handleLineChange(index, e.target.value)}
                        placeholder={`Línea ${index + 1}`}
                        className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm text-white
                                 border border-white/10 focus:border-brand-500 focus:outline-none
                                 focus:ring-1 focus:ring-brand-500 placeholder-gray-600"
                      />
                      {lines.length > 1 && (
                        <button
                          onClick={() => handleRemoveLine(index)}
                          className="p-2 rounded text-gray-500 hover:text-red-400 hover:bg-surface transition-colors"
                          aria-label={`Eliminar línea ${index + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddLine}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                             border border-dashed border-white/20 text-gray-500 hover:text-white
                             hover:border-brand-500 transition-colors text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar línea
                  </button>

                  {/* Notes */}
                  <div className="pt-4 border-t border-white/10">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                      Notas del operador
                    </label>
                    <textarea
                      defaultValue={slide.notes || ''}
                      placeholder="Notas internas..."
                      rows={3}
                      className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-white
                               border border-white/10 focus:border-brand-500 focus:outline-none
                               focus:ring-1 focus:ring-brand-500 placeholder-gray-600 resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'background' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                      Color de fondo
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleBackgroundColorChange(color)}
                          className={cn(
                            'aspect-square rounded-lg border-2 transition-all',
                            slide.background_color === color
                              ? 'border-brand-500 ring-2 ring-brand-500/30 scale-110'
                              : 'border-white/10 hover:border-white/30'
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                      Color personalizado
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide.background_color || '#000000'}
                        onChange={(e) => handleBackgroundColorChange(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border border-white/10"
                      />
                      <input
                        type="text"
                        value={slide.background_color || '#000000'}
                        onChange={(e) => handleBackgroundColorChange(e.target.value)}
                        className="flex-1 bg-surface rounded-lg px-3 py-2 text-sm text-white font-mono
                                 border border-white/10 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-2">
                      Imagen de fondo
                    </label>
                    <button className="w-full py-8 rounded-lg border border-dashed border-white/20
                                     text-gray-500 hover:text-white hover:border-brand-500 transition-colors text-sm">
                      <Image className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      Subir imagen
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Seleccionar tema
                  </label>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-all',
                        slide.theme_id === theme.id
                          ? 'border-brand-500 bg-brand-600/10'
                          : 'border-white/10 hover:border-white/20 bg-surface'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Theme preview swatch */}
                        <div
                          className="w-12 h-8 rounded flex items-center justify-center text-[0.4rem] font-bold"
                          style={{
                            backgroundColor: theme.background_color || '#000',
                            color: theme.font_color,
                            fontFamily: theme.font_family,
                          }}
                        >
                          Aa
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{theme.name}</p>
                          <p className="text-xs text-gray-500">
                            {theme.font_family} · {theme.font_size}px · {theme.text_align}
                          </p>
                        </div>
                        {theme.is_default && (
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-brand-600/20 text-brand-400 font-medium">
                            Default
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
