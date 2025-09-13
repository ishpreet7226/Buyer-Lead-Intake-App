import { prisma } from './db';
import { BuyerForm, BuyerFilters, Buyer } from './schemas';
import { Prisma } from '@prisma/client';

export async function createBuyer(data: BuyerForm, ownerId: string) {
  const buyer = await prisma.buyer.create({
    data: {
      ...data,
      ownerId,
      tags: data.tags || null,
    },
  });

  // Create history entry
  await prisma.buyerHistory.create({
    data: {
      buyerId: buyer.id,
      changedBy: ownerId,
      diff: {
        action: 'created',
        fields: data,
      },
    },
  });

  return buyer;
}

export async function updateBuyer(id: string, data: Partial<BuyerForm>, ownerId: string, currentData: {
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
}) {
  // Check ownership
  if (currentData.ownerId !== ownerId) {
    throw new Error('Unauthorized: You can only edit your own buyers');
  }

  const updatedBuyer = await prisma.buyer.update({
    where: { id },
    data: {
      ...data,
      tags: data.tags || null,
    },
  });

  // Create history entry with diff
  const diff: Record<string, unknown> = {};
  Object.keys(data).forEach(key => {
    if (data[key as keyof BuyerForm] !== currentData[key as keyof Buyer]) {
      diff[key] = {
        from: currentData[key as keyof Buyer],
        to: data[key as keyof BuyerForm],
      };
    }
  });

  if (Object.keys(diff).length > 0) {
    await prisma.buyerHistory.create({
      data: {
        buyerId: id,
        changedBy: ownerId,
        diff: {
          action: 'updated',
          fields: diff,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    });
  }

  return updatedBuyer;
}

export async function getBuyer(id: string) {
  return prisma.buyer.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      history: {
        orderBy: { changedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          changedBy: true,
          changedAt: true,
          diff: true,
        },
      },
    },
  });
}

export async function getBuyers(filters: BuyerFilters) {
  const where: Prisma.BuyerWhereInput = {};

  // Search filter
  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search } },
      { email: { contains: filters.search } },
      { phone: { contains: filters.search } },
      { notes: { contains: filters.search } },
    ];
  }

  // Other filters
  if (filters.city) where.city = filters.city;
  if (filters.propertyType) where.propertyType = filters.propertyType;
  if (filters.status) where.status = filters.status;
  if (filters.timeline) where.timeline = filters.timeline;

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { [filters.sortBy]: filters.sortOrder },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.buyer.count({ where }),
  ]);

  return {
    buyers,
    total,
    pages: Math.ceil(total / filters.limit),
    currentPage: filters.page,
  };
}

export async function deleteBuyer(id: string, ownerId: string) {
  const buyer = await prisma.buyer.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!buyer) {
    throw new Error('Buyer not found');
  }

  if (buyer.ownerId !== ownerId) {
    throw new Error('Unauthorized: You can only delete your own buyers');
  }

  return prisma.buyer.delete({
    where: { id },
  });
}

export async function createBuyersFromCSV(csvData: unknown[], ownerId: string) {
  const results = {
    success: [] as unknown[],
    errors: [] as { row: number; error: string }[],
  };

  for (let i = 0; i < csvData.length; i++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buyer = await createBuyer(csvData[i] as any, ownerId);
      results.success.push(buyer);
    } catch (error) {
      results.errors.push({
        row: i + 1,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBudget(min?: number | null, max?: number | null) {
  if (!min && !max) return 'Not specified';
  if (!min) return `Up to ${formatCurrency(max!)}`;
  if (!max) return `From ${formatCurrency(min)}`;
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}
