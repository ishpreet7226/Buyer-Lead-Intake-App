'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth';
import { CSVBuyerSchema } from '@/lib/schemas';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface CSVImportProps {
  user: User;
}

export function CSVImport({ }: CSVImportProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    success: unknown[];
    errors: { row: number; error: string }[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('File is empty');
      }

      if (lines.length > 200) {
        throw new Error('File has too many rows. Maximum 200 rows allowed.');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = [
        'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk',
        'purpose', 'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
      ];

      if (!expectedHeaders.every(h => headers.includes(h))) {
        throw new Error('Invalid CSV format. Please download the template for the correct format.');
      }

      const csvData = lines.slice(1).map((line) => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        
        return row;
      });

      // Validate each row
      const validatedData: unknown[] = [];
      const errors: { row: number; error: string }[] = [];

      csvData.forEach((row, index) => {
        try {
          const validated = CSVBuyerSchema.parse(row);
          validatedData.push(validated);
        } catch (error) {
          errors.push({
            row: index + 2, // +2 because we skip header and arrays are 0-indexed
            error: error instanceof Error ? error.message : 'Validation error'
          });
        }
      });

      if (validatedData.length === 0) {
        setResults({ success: [], errors });
        return;
      }

      // Import valid data
      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyers: validatedData }),
      });

      const importResults = await response.json();

      setResults({
        success: importResults.success || [],
        errors: [...errors, ...(importResults.errors || [])]
      });

    } catch (error) {
      setResults({
        success: [],
        errors: [{ row: 0, error: error instanceof Error ? error.message : 'Import failed' }]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk',
      'purpose', 'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
    ];
    
    const sampleData = [
      'John Doe', 'john@example.com', '9876543210', 'Chandigarh', 'Apartment', 'Two',
      'Buy', '5000000', '8000000', 'ZeroToThree', 'Website', 'Interested in 2BHK', 'premium,urgent', 'New'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyers-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Import Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Download the template CSV file to see the correct format</li>
          <li>• Maximum 200 rows allowed per import</li>
          <li>• Required fields: fullName, phone, city, propertyType, purpose, timeline, source</li>
          <li>• BHK is required for Apartment and Villa property types</li>
          <li>• Valid cities: Chandigarh, Mohali, Zirakpur, Panchkula, Other</li>
          <li>• Valid property types: Apartment, Villa, Plot, Office, Retail</li>
        </ul>
      </div>

      {/* File Upload */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload CSV File</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>

            <button
              onClick={handleImport}
              disabled={!file || isProcessing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Import Buyers'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Success */}
            <div>
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Successfully Imported ({results.success.length})
                </span>
              </div>
              {results.success.length > 0 && (
                <div className="text-sm text-green-700">
                  {results.success.map((buyer, index) => (
                    <div key={index} className="truncate">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(buyer as any).fullName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Errors */}
            <div>
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Errors ({results.errors.length})
                </span>
              </div>
              {results.errors.length > 0 && (
                <div className="text-sm text-red-700 space-y-1">
                  {results.errors.map((error, index) => (
                    <div key={index}>
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {results.success.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => router.push('/buyers')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View All Buyers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
