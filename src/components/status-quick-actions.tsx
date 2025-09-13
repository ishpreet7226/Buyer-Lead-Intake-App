'use client';

import { useState } from 'react';
import { Status, StatusLabels } from '@/lib/schemas';
import { ChevronDown } from 'lucide-react';

interface StatusQuickActionsProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
  disabled?: boolean;
}

export function StatusQuickActions({ currentStatus, onStatusChange, disabled }: StatusQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions: Status[] = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'];

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Visited': return 'bg-purple-100 text-purple-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      case 'Dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentStatus)} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
        }`}
      >
        {StatusLabels[currentStatus]}
        <ChevronDown className="ml-1 h-3 w-3" />
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
            <div className="py-1">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    status === currentStatus ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {StatusLabels[status]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
