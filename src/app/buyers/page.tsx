import { getBuyers } from '@/lib/buyer-utils';
import { requireAuth } from '@/lib/auth';
import { BuyerFiltersSchema } from '@/lib/schemas';
import { BuyersList } from '@/components/buyers-list';
import { Suspense } from 'react';

interface BuyersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  await requireAuth();
  
  const resolvedSearchParams = await searchParams;
  
  const filters = BuyerFiltersSchema.parse({
    search: resolvedSearchParams.search as string,
    city: resolvedSearchParams.city as string,
    propertyType: resolvedSearchParams.propertyType as string,
    status: resolvedSearchParams.status as string,
    timeline: resolvedSearchParams.timeline as string,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1,
    limit: resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit as string) : 10,
    sortBy: resolvedSearchParams.sortBy as string || 'updatedAt',
    sortOrder: resolvedSearchParams.sortOrder as string || 'desc',
  });

  const { buyers, total, pages, currentPage } = await getBuyers(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Leads</h1>
          <p className="mt-2 text-gray-600">
            Manage and track your buyer leads
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <BuyersList
            initialBuyers={buyers}
            initialTotal={total}
            initialPages={pages}
            initialCurrentPage={currentPage}
            initialFilters={filters}
          />
        </Suspense>
      </div>
    </div>
  );
}
