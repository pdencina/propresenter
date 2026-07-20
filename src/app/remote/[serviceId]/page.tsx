import { RemoteControl } from '@/components/remote/RemoteControl';

interface RemotePageProps {
  params: { serviceId: string };
}

export default function RemotePage({ params }: RemotePageProps) {
  return <RemoteControl serviceId={params.serviceId} />;
}
