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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Buyer Leads</h1>
              <p className="text-lg text-gray-600">
                Manage and track your buyer leads with advanced filtering
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{total}</div>
                <div className="text-sm text-gray-500">Total Leads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="slide-up">
          <Suspense fallback={
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading leads...</span>
                </div>
              </div>
            </div>
          }>
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
    </div>
  );
}
