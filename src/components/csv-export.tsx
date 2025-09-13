'use client';

import { useState } from 'react';
import { CityLabels, PropertyTypeLabels, BHKLabels, PurposeLabels, TimelineLabels, SourceLabels, StatusLabels } from '@/lib/schemas';
import { Download, FileText } from 'lucide-react';

interface CSVExportProps {
  buyers: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string;
    city: string;
    propertyType: string;
    bhk: string | null;
    purpose: string;
    budgetMin: number | null;
    budgetMax: number | null;
    timeline: string;
    source: string;
    status: string;
    notes: string | null;
    tags: string | null;
    ownerId: string;
    updatedAt: Date;
    createdAt: Date;
  }[];
}

export function CSVExport({ buyers }: CSVExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);

    try {
      const headers = [
        'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk',
        'purpose', 'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
      ];

      const csvData = buyers.map(buyer => [
        buyer.fullName,
        buyer.email || '',
        buyer.phone,
        CityLabels[buyer.city as keyof typeof CityLabels],
        PropertyTypeLabels[buyer.propertyType as keyof typeof PropertyTypeLabels],
        buyer.bhk ? BHKLabels[buyer.bhk as keyof typeof BHKLabels] : '',
        PurposeLabels[buyer.purpose as keyof typeof PurposeLabels],
        buyer.budgetMin?.toString() || '',
        buyer.budgetMax?.toString() || '',
        TimelineLabels[buyer.timeline as keyof typeof TimelineLabels],
        SourceLabels[buyer.source as keyof typeof SourceLabels],
        buyer.notes || '',
        buyer.tags || '',
        StatusLabels[buyer.status as keyof typeof StatusLabels]
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buyers-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Summary</h3>
            <p className="mt-1 text-sm text-gray-600">
              {buyers.length} buyer{buyers.length !== 1 ? 's' : ''} ready for export
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{buyers.length}</div>
              <div className="text-xs text-gray-500">Total Records</div>
            </div>
            <button
              onClick={exportToCSV}
              disabled={isExporting || buyers.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {buyers.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview (First 10 Records)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buyers.slice(0, 10).map((buyer) => (
                  <tr key={buyer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {buyer.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {buyer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {CityLabels[buyer.city as keyof typeof CityLabels]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {PropertyTypeLabels[buyer.propertyType as keyof typeof PropertyTypeLabels]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {StatusLabels[buyer.status as keyof typeof StatusLabels]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {buyers.length > 10 && (
            <p className="mt-2 text-sm text-gray-500">
              ... and {buyers.length - 10} more records
            </p>
          )}
        </div>
      )}

      {/* Export Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Export Information</h4>
            <ul className="mt-1 text-sm text-gray-600 space-y-1">
              <li>• CSV file will include all visible buyer data</li>
              <li>• File will be named with current date</li>
              <li>• All special characters will be properly escaped</li>
              <li>• Empty fields will be included as empty cells</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
