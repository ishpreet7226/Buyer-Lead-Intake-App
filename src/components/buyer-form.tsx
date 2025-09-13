'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BuyerFormSchema, CityLabels, PropertyTypeLabels, BHKLabels, PurposeLabels, TimelineLabels, SourceLabels, StatusLabels } from '@/lib/schemas';
import { User } from '@/lib/auth';
import { createBuyer, updateBuyer } from '@/lib/buyer-utils';

interface BuyerFormProps {
  user: User;
  buyer?: {
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
  };
  isEditing?: boolean;
}

export function BuyerForm({ user, buyer, isEditing = false }: BuyerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof BuyerFormSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(BuyerFormSchema) as any,
    defaultValues: buyer ? {
      fullName: buyer.fullName,
      email: buyer.email || '',
      phone: buyer.phone,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      city: buyer.city as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      propertyType: buyer.propertyType as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bhk: buyer.bhk as any || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      purpose: buyer.purpose as any,
      budgetMin: buyer.budgetMin || undefined,
      budgetMax: buyer.budgetMax || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      timeline: buyer.timeline as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      source: buyer.source as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: buyer.status as any || 'New',
      notes: buyer.notes || '',
      tags: buyer.tags || '',
    } : undefined,
  });

  const propertyType = watch('propertyType');
  const showBHK = propertyType === 'Apartment' || propertyType === 'Villa';

  const onSubmit = async (data: z.infer<typeof BuyerFormSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing && buyer) {
        await updateBuyer(buyer.id, data, user.id, buyer);
      } else {
        await createBuyer(data, user.id);
      }
      router.push('/buyers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              {...register('fullName')}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <select
              {...register('city')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select city</option>
              {Object.entries(CityLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
              Property Type *
            </label>
            <select
              {...register('propertyType')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select property type</option>
              {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.propertyType && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>

          {showBHK && (
            <div>
              <label htmlFor="bhk" className="block text-sm font-medium text-gray-700">
                BHK *
              </label>
              <select
                {...register('bhk')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select BHK</option>
                {Object.entries(BHKLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.bhk && (
                <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose *
            </label>
            <select
              {...register('purpose')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select purpose</option>
              {Object.entries(PurposeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
              Timeline *
            </label>
            <select
              {...register('timeline')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select timeline</option>
              {Object.entries(TimelineLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.timeline && (
              <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget & Source</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700">
              Min Budget (INR)
            </label>
            <input
              {...register('budgetMin', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter minimum budget"
            />
            {errors.budgetMin && (
              <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700">
              Max Budget (INR)
            </label>
            <input
              {...register('budgetMax', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter maximum budget"
            />
            {errors.budgetMax && (
              <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Source *
            </label>
            <select
              {...register('source')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select source</option>
              {Object.entries(SourceLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.source && (
              <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
            )}
          </div>

          {isEditing && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register('status')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(StatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any additional notes"
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              {...register('tags')}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tags separated by commas"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
