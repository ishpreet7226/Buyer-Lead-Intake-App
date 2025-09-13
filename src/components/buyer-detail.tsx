'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CityLabels, PropertyTypeLabels, BHKLabels, PurposeLabels, TimelineLabels, SourceLabels, StatusLabels } from '@/lib/schemas';
import { User } from '@/lib/auth';
import { formatBudget } from '@/lib/buyer-utils';
import { BuyerForm } from './buyer-form';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';

interface BuyerDetailProps {
  buyer: {
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
    history: Array<{
      id: string;
      changedBy: string;
      changedAt: Date;
      diff: unknown;
    }>;
  };
  user: User;
}

export function BuyerDetail({ buyer, user }: BuyerDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = buyer.ownerId === user.id;

  const handleDelete = async () => {
    if (!isOwner) return;
    
    try {
      const response = await fetch(`/api/buyers/${buyer.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/buyers');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete buyer');
      }
    } catch {
      alert('Failed to delete buyer');
    }
  };

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to view
          </button>
        </div>
        <BuyerForm buyer={buyer} user={user} isEditing={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{buyer.fullName}</h1>
            <p className="text-gray-600">
              Created by {buyer.owner.name || buyer.owner.email} • {new Date(buyer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Buyer</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this buyer? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{CityLabels[buyer.city as keyof typeof CityLabels]}</dd>
              </div>
            </dl>
          </div>

          {/* Property Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{PropertyTypeLabels[buyer.propertyType as keyof typeof PropertyTypeLabels]}</dd>
              </div>
              {buyer.bhk && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">BHK</dt>
                  <dd className="mt-1 text-sm text-gray-900">{BHKLabels[buyer.bhk as keyof typeof BHKLabels]}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900">{PurposeLabels[buyer.purpose as keyof typeof PurposeLabels]}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                <dd className="mt-1 text-sm text-gray-900">{TimelineLabels[buyer.timeline as keyof typeof TimelineLabels]}</dd>
              </div>
            </dl>
          </div>

          {/* Budget & Source */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget & Source</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget Range</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatBudget(buyer.budgetMin, buyer.budgetMax)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{SourceLabels[buyer.source as keyof typeof SourceLabels]}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    buyer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    buyer.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                    buyer.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    buyer.status === 'Visited' ? 'bg-purple-100 text-purple-800' :
                    buyer.status === 'Negotiation' ? 'bg-orange-100 text-orange-800' :
                    buyer.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {StatusLabels[buyer.status as keyof typeof StatusLabels]}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Additional Information */}
          {(buyer.notes || buyer.tags) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              {buyer.notes && (
                <div className="mb-4">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{buyer.notes}</dd>
                </div>
              )}
              {buyer.tags && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.tags}</dd>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* History */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Changes</h3>
            <div className="space-y-4">
              {buyer.history.length === 0 ? (
                <p className="text-sm text-gray-500">No changes recorded</p>
              ) : (
                buyer.history.map((change) => (
                  <div key={change.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="text-sm text-gray-900">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(change.diff as any)?.action === 'created' ? 'Created' : 'Updated'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(change.changedAt).toLocaleString()}
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(change.diff as any)?.fields && Object.keys((change.diff as any).fields).length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {Object.entries((change.diff as any).fields).map(([field, value]) => (
                          <div key={field}>
                            <span className="font-medium">{field}:</span>{' '}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {typeof value === 'object' && value && (value as any).from !== undefined
                              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                `${(value as any).from} → ${(value as any).to}`
                              : String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {isOwner && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  Delete Lead
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
