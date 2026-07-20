'use client';

import { cn } from '@/lib/utils';
import type { ServiceSection } from '@/types';
import { Music, BookOpen, Megaphone, Film, FileText, Plus, GripVertical } from 'lucide-react';

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
  song: 'text-emerald-400 bg-emerald-400/10',
  scripture: 'text-amber-400 bg-amber-400/10',
  announcement: 'text-purple-400 bg-purple-400/10',
  media: 'text-blue-400 bg-blue-400/10',
  custom: 'text-gray-400 bg-gray-400/10',
};

const sectionBorderColors: Record<ServiceSection['type'], string> = {
  song: 'border-l-emerald-400',
  scripture: 'border-l-amber-400',
  announcement: 'border-l-purple-400',
  media: 'border-l-blue-400',
  custom: 'border-l-gray-400',
};

export function ServiceSidebar({
  sections,
  activeSectionId,
  onSectionSelect,
}: ServiceSidebarProps) {
  return (
    <aside className="w-72 bg-surface-light/50 backdrop-blur-sm border-r border-white/[0.06] flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.65rem] font-semibold text-white/40 uppercase tracking-[0.15em]">
            Orden del Servicio
          </h2>
          <span className="text-[0.6rem] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md font-medium">
            {sections.length}
          </span>
        </div>
      </div>

      {/* Section list */}
      <nav className="flex-1 overflow-y-auto py-2 px-2" role="list" aria-label="Secciones del servicio">
        <div className="space-y-1">
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.type];
            const isActive = section.id === activeSectionId;
            const colorClasses = sectionColors[section.type];
            const borderColor = sectionBorderColors[section.type];

            return (
              <button
                key={section.id}
                onClick={() => onSectionSelect(section.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-left transition-all duration-200 group border-l-[3px]',
                  isActive
                    ? `bg-white/[0.06] ${borderColor} shadow-lg shadow-black/10`
                    : 'border-l-transparent hover:bg-white/[0.03] hover:border-l-white/20'
                )}
                role="listitem"
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Drag handle (visual only) */}
                <GripVertical className={cn(
                  'w-3 h-3 flex-shrink-0 transition-opacity',
                  isActive ? 'text-white/20' : 'text-white/0 group-hover:text-white/20'
                )} />

                {/* Icon with colored bg */}
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                  colorClasses.split(' ').slice(1).join(' ')
                )}>
                  <Icon className={cn('w-3.5 h-3.5', colorClasses.split(' ')[0])} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-[0.8rem] truncate leading-tight',
                    isActive ? 'text-white font-medium' : 'text-white/70'
                  )}>
                    {section.title}
                  </p>
                  <p className={cn(
                    'text-[0.65rem] mt-0.5',
                    isActive ? 'text-white/40' : 'text-white/30'
                  )}>
                    {section.slides.length} slide{section.slides.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Index badge */}
                <span className={cn(
                  'w-5 h-5 rounded-md flex items-center justify-center text-[0.6rem] font-medium flex-shrink-0',
                  isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-white/30'
                )}>
                  {index + 1}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Add section button */}
      <div className="p-3 border-t border-white/[0.06]">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                         border border-dashed border-white/10 hover:border-brand-500/40
                         text-white/40 hover:text-brand-400
                         transition-all duration-200 text-xs font-medium
                         hover:bg-brand-500/5">
          <Plus className="w-3.5 h-3.5" />
          Agregar sección
        </button>
      </div>
    </aside>
  );
}
