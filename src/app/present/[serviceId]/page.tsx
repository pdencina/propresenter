import { PresenterView } from '@/components/presenter/PresenterView';

interface PresenterPageProps {
  params: { serviceId: string };
}

export default function PresenterPage({ params }: PresenterPageProps) {
  return <PresenterView serviceId={params.serviceId} />;
}
