import { getBuyer } from '@/lib/buyer-utils';
import { requireAuth } from '@/lib/auth';
import { BuyerDetail } from '@/components/buyer-detail';
import { notFound } from 'next/navigation';

interface BuyerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuyerDetailPage({ params }: BuyerDetailPageProps) {
  const user = await requireAuth();
  const { id } = await params;
  const buyer = await getBuyer(id);

  if (!buyer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BuyerDetail buyer={buyer} user={user} />
      </div>
    </div>
  );
}
