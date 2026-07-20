import { EditorLayout } from '@/components/editor';
import { mockService, mockThemes } from '@/lib/mock-data';

export default function EditorPage() {
  return <EditorLayout service={mockService} themes={mockThemes} />;
}
