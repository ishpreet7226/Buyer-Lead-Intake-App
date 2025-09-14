'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuyerFilters, CityLabels, PropertyTypeLabels, TimelineLabels, StatusLabels } from '@/lib/schemas';
import { formatBudget } from '@/lib/buyer-utils';
import Link from 'next/link';
import { Search, Plus, Download, Upload, Filter, Trash2 } from 'lucide-react';

interface BuyersListProps {
  initialBuyers: {
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
    owner: { id: string; name: string | null; email: string };
  }[];
  initialTotal: number;
  initialPages: number;
  initialCurrentPage: number;
  initialFilters: BuyerFilters;
}

export function BuyersList({
  initialBuyers,
  initialTotal,
  initialPages,
  initialCurrentPage,
  initialFilters,
}: BuyersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  
  const [buyers] = useState(initialBuyers);
  const [total] = useState(initialTotal);
  const [pages] = useState(initialPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters: Partial<BuyerFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams(searchParams);
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    
    startTransition(() => {
      router.push(`/buyers?${params.toString()}`);
    });
  };

  const handleSearch = (search: string) => {
    updateFilters({ search: search || undefined });
  };

  const handleFilterChange = (key: keyof BuyerFilters, value: string) => {
    updateFilters({ [key]: value || undefined });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    startTransition(() => {
      router.push(`/buyers?${params.toString()}`);
    });
  };

  const handleDelete = async (buyerId: string, buyerName: string) => {
    if (!confirm(`Are you sure you want to delete ${buyerName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/buyers/${buyerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error deleting buyer: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting buyer:', error);
      alert('Error deleting buyer. Please try again.');
    }
  };

  const handleSort = (sortBy: string) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortBy: sortBy as 'updatedAt' | 'createdAt' | 'fullName', sortOrder });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search buyers by name, email, phone, or notes..."
                  className="input pl-10 pr-4 py-3 w-full"
                  defaultValue={filters.search || ''}
                  onChange={(e) => {
                    const timeoutId = setTimeout(() => handleSearch(e.target.value), 300);
                    return () => clearTimeout(timeoutId);
                  }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-outline flex items-center px-4 py-2 ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.values(filters).some(v => v && v !== '') && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {Object.values(filters).filter(v => v && v !== '').length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/buyers/import"
                className="btn btn-outline flex items-center px-4 py-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Link>
              <Link
                href="/buyers/export"
                className="btn btn-outline flex items-center px-4 py-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Link>
              <Link
                href="/buyers/new"
                className="btn btn-primary flex items-center px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Lead
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card animate-in">
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input"
                >
                  <option value="">All Cities</option>
                  {Object.entries(CityLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.propertyType || ''}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="input"
                >
                  <option value="">All Types</option>
                  {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(StatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                <select
                  value={filters.timeline || ''}
                  onChange={(e) => handleFilterChange('timeline', e.target.value)}
                  className="input"
                >
                  <option value="">All Timelines</option>
                  {Object.entries(TimelineLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm border">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{buyers.length}</span> of{' '}
          <span className="font-medium text-gray-900">{total}</span> buyers
        </p>
        <div className="text-sm text-gray-600">
          Page <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
          <span className="font-medium text-gray-900">{pages}</span>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('fullName')}
                    className="flex items-center hover:text-gray-900 transition-colors"
                  >
                    Name
                    {filters.sortBy === 'fullName' && (
                      <span className="ml-1 text-blue-600">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('updatedAt')}
                    className="flex items-center hover:text-gray-900 transition-colors"
                  >
                    Updated
                    {filters.sortBy === 'updatedAt' && (
                      <span className="ml-1 text-blue-600">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buyers.map((buyer, index) => (
                <tr 
                  key={buyer.id} 
                  className="hover:bg-blue-50 transition-colors duration-150"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {buyer.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{buyer.fullName}</div>
                        {buyer.email && (
                          <div className="text-sm text-gray-500">{buyer.email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{buyer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {CityLabels[buyer.city as keyof typeof CityLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {PropertyTypeLabels[buyer.propertyType as keyof typeof PropertyTypeLabels]}
                    </div>
                    {buyer.bhk && (
                      <div className="text-xs text-gray-500">{buyer.bhk}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatBudget(buyer.budgetMin, buyer.budgetMax)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {TimelineLabels[buyer.timeline as keyof typeof TimelineLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      buyer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      buyer.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                      buyer.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      buyer.status === 'Visited' ? 'bg-purple-100 text-purple-800' :
                      buyer.status === 'Negotiation' ? 'bg-orange-100 text-orange-800' :
                      buyer.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {StatusLabels[buyer.status as keyof typeof StatusLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(buyer.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/buyers/${buyer.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        View/Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(buyer.id, buyer.fullName)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete buyer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pages}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                  <span className="font-semibold text-gray-900">{pages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
