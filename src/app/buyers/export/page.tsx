import { requireAuth } from '@/lib/auth';
import { getBuyers } from '@/lib/buyer-utils';
import { BuyerExportFiltersSchema } from '@/lib/schemas';
import { CSVExport } from '@/components/csv-export';

interface ExportPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExportPage({ searchParams }: ExportPageProps) {
  await requireAuth();
  
  const resolvedSearchParams = await searchParams;
  
  const filters = BuyerExportFiltersSchema.parse({
    search: resolvedSearchParams.search as string,
    city: resolvedSearchParams.city as string,
    propertyType: resolvedSearchParams.propertyType as string,
    status: resolvedSearchParams.status as string,
    timeline: resolvedSearchParams.timeline as string,
    page: 1,
    limit: 1000, // Export more records
    sortBy: resolvedSearchParams.sortBy as string || 'updatedAt',
    sortOrder: resolvedSearchParams.sortOrder as string || 'desc',
  });

  const { buyers } = await getBuyers(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Export Buyers</h1>
          <p className="mt-2 text-gray-600">
            Export buyer leads to CSV file
          </p>
        </div>

        <CSVExport buyers={buyers} />
      </div>
    </div>
  );
}
