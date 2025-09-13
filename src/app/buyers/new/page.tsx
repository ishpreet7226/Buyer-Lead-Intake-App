import { requireAuth } from '@/lib/auth';
import { BuyerForm } from '@/components/buyer-form';

export default async function NewBuyerPage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Buyer Lead</h1>
          <p className="mt-2 text-gray-600">
            Add a new buyer lead to your pipeline
          </p>
        </div>

        <BuyerForm user={user} />
      </div>
    </div>
  );
}
