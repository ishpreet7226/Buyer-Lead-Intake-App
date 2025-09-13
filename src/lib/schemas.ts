import { z } from 'zod';

// Enum schemas matching Prisma enums
export const CitySchema = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const PropertyTypeSchema = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const BHKSchema = z.enum(['Studio', 'One', 'Two', 'Three', 'Four']);
export const PurposeSchema = z.enum(['Buy', 'Rent']);
export const TimelineSchema = z.enum(['ZeroToThree', 'ThreeToSix', 'MoreThanSix', 'Exploring']);
export const SourceSchema = z.enum(['Website', 'Referral', 'WalkIn', 'Call', 'Other']);
export const StatusSchema = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

// Display mappings for UI
export const CityLabels = {
  Chandigarh: 'Chandigarh',
  Mohali: 'Mohali',
  Zirakpur: 'Zirakpur',
  Panchkula: 'Panchkula',
  Other: 'Other'
} as const;

export const PropertyTypeLabels = {
  Apartment: 'Apartment',
  Villa: 'Villa',
  Plot: 'Plot',
  Office: 'Office',
  Retail: 'Retail'
} as const;

export const BHKLabels = {
  Studio: 'Studio',
  One: '1 BHK',
  Two: '2 BHK',
  Three: '3 BHK',
  Four: '4 BHK'
} as const;

export const PurposeLabels = {
  Buy: 'Buy',
  Rent: 'Rent'
} as const;

export const TimelineLabels = {
  ZeroToThree: '0-3 months',
  ThreeToSix: '3-6 months',
  MoreThanSix: '>6 months',
  Exploring: 'Exploring'
} as const;

export const SourceLabels = {
  Website: 'Website',
  Referral: 'Referral',
  WalkIn: 'Walk-in',
  Call: 'Call',
  Other: 'Other'
} as const;

export const StatusLabels = {
  New: 'New',
  Qualified: 'Qualified',
  Contacted: 'Contacted',
  Visited: 'Visited',
  Negotiation: 'Negotiation',
  Converted: 'Converted',
  Dropped: 'Dropped'
} as const;

// Main buyer schema
export const BuyerSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be at most 80 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: CitySchema,
  propertyType: PropertyTypeSchema,
  bhk: BHKSchema.optional(),
  purpose: PurposeSchema,
  budgetMin: z.number().int().min(0, 'Budget must be positive').optional(),
  budgetMax: z.number().int().min(0, 'Budget must be positive').optional(),
  timeline: TimelineSchema,
  source: SourceSchema,
  status: StatusSchema.default('New'),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
  tags: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
}).refine((data) => {
  // BHK is required for Apartment and Villa
  if ((data.propertyType === 'Apartment' || data.propertyType === 'Villa') && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
}).refine((data) => {
  // budgetMax must be >= budgetMin if both are present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// Form schema for creating/editing buyers
export const BuyerFormSchema = BuyerSchema.omit({
  id: true,
  ownerId: true,
  updatedAt: true,
  createdAt: true,
}).extend({
  email: z.string().optional(),
  tags: z.string().optional(),
  status: StatusSchema.default('New'),
}).refine((data) => {
  // BHK is required for Apartment and Villa
  if ((data.propertyType === 'Apartment' || data.propertyType === 'Villa') && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
}).refine((data) => {
  // budgetMax must be >= budgetMin if both are present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// CSV import schema
export const CSVBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/),
  city: CitySchema,
  propertyType: PropertyTypeSchema,
  bhk: BHKSchema.optional().or(z.literal('')),
  purpose: PurposeSchema,
  budgetMin: z.string().transform((val) => val ? parseInt(val, 10) : undefined).pipe(z.number().int().min(0).optional()),
  budgetMax: z.string().transform((val) => val ? parseInt(val, 10) : undefined).pipe(z.number().int().min(0).optional()),
  timeline: TimelineSchema,
  source: SourceSchema,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  status: StatusSchema.default('New'),
}).refine((data) => {
  // BHK is required for Apartment and Villa
  if ((data.propertyType === 'Apartment' || data.propertyType === 'Villa') && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
}).refine((data) => {
  // budgetMax must be >= budgetMin if both are present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// Search and filter schemas
export const BuyerFiltersSchema = z.object({
  search: z.string().optional(),
  city: CitySchema.optional(),
  propertyType: PropertyTypeSchema.optional(),
  status: StatusSchema.optional(),
  timeline: TimelineSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['updatedAt', 'createdAt', 'fullName']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export filter schema with higher limit
export const BuyerExportFiltersSchema = z.object({
  search: z.string().optional(),
  city: CitySchema.optional(),
  propertyType: PropertyTypeSchema.optional(),
  status: StatusSchema.optional(),
  timeline: TimelineSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(1000).default(1000),
  sortBy: z.enum(['updatedAt', 'createdAt', 'fullName']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type Buyer = z.infer<typeof BuyerSchema>;
export type BuyerForm = z.infer<typeof BuyerFormSchema>;
export type CSVBuyer = z.infer<typeof CSVBuyerSchema>;
export type BuyerFilters = z.infer<typeof BuyerFiltersSchema>;
export type BuyerExportFilters = z.infer<typeof BuyerExportFiltersSchema>;
export type City = z.infer<typeof CitySchema>;
export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type BHK = z.infer<typeof BHKSchema>;
export type Purpose = z.infer<typeof PurposeSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Status = z.infer<typeof StatusSchema>;
