import { requireAuth } from '@/lib/auth';
import { CSVImport } from '@/components/csv-import';

export default async function ImportPage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import Buyers</h1>
          <p className="mt-2 text-gray-600">
            Import buyer leads from a CSV file
          </p>
        </div>

        <CSVImport user={user} />
      </div>
    </div>
  );
}
