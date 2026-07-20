// Domain types used across the app

export interface SlideContent {
  lines: string[];
}

export interface Slide {
  id: string;
  section_id: string;
  order_index: number;
  content: SlideContent;
  theme_id: string | null;
  background_url: string | null;
  background_color: string | null;
  notes: string | null;
}

export interface ServiceSection {
  id: string;
  service_id: string;
  title: string;
  type: 'song' | 'scripture' | 'custom' | 'media' | 'announcement';
  order_index: number;
  slides: Slide[];
}

export interface Service {
  id: string;
  organization_id: string;
  title: string;
  date: string;
  status: 'draft' | 'ready' | 'live' | 'archived';
  sections: ServiceSection[];
}

export interface Theme {
  id: string;
  name: string;
  font_family: string;
  font_size: number;
  font_color: string;
  font_weight: string;
  text_align: 'left' | 'center' | 'right';
  text_shadow: boolean;
  background_color: string | null;
  background_image_url: string | null;
  padding: string;
  is_default: boolean;
}

export interface LiveSession {
  id: string;
  service_id: string;
  current_slide_id: string | null;
  is_live: boolean;
}
