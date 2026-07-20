'use client';

import { cn } from '@/lib/utils';
import type { ServiceSection } from '@/types';
import { Music, BookOpen, Megaphone, Film, FileText, Plus } from 'lucide-react';

interface ServiceSidebarProps {
  sections: ServiceSection[];
  activeSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
}

const sectionIcons: Record<ServiceSection['type'], React.ElementType> = {
  song: Music,
  scripture: BookOpen,
  announcement: Megaphone,
  media: Film,
  custom: FileText,
};

const sectionColors: Record<ServiceSection['type'], string> = {
  song: 'text-emerald-400',
  scripture: 'text-amber-400',
  announcement: 'text-purple-400',
  media: 'text-blue-400',
  custom: 'text-gray-400',
};

export function ServiceSidebar({
  sections,
  activeSectionId,
  onSectionSelect,
}: ServiceSidebarProps) {
  return (
    <aside className="w-64 bg-surface-light border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Orden del Servicio
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1" role="list" aria-label="Secciones del servicio">
        {sections.map((section, index) => {
          const Icon = sectionIcons[section.type];
          const isActive = section.id === activeSectionId;

          return (
            <button
              key={section.id}
              onClick={() => onSectionSelect(section.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                isActive
                  ? 'bg-brand-600/20 border border-brand-500/30'
                  : 'hover:bg-surface-lighter border border-transparent'
              )}
              role="listitem"
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded bg-surface-lighter text-xs text-gray-500 font-medium">
                {index + 1}
              </span>
              <Icon className={cn('w-4 h-4 flex-shrink-0', sectionColors[section.type])} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm truncate',
                  isActive ? 'text-white font-medium' : 'text-gray-300'
                )}>
                  {section.title}
                </p>
                <p className="text-xs text-gray-500">
                  {section.slides.length} slide{section.slides.length !== 1 ? 's' : ''}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                         bg-surface-lighter hover:bg-brand-600/20 text-gray-400 hover:text-white
                         transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Agregar sección
        </button>
      </div>
    </aside>
  );
}
