import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getBuyer, updateBuyer, deleteBuyer } from '@/lib/buyer-utils';
import { BuyerFormSchema } from '@/lib/schemas';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await requireAuth();
    const buyer = await getBuyer(id);
    
    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }
    
    return NextResponse.json(buyer);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    const validatedData = BuyerFormSchema.partial().parse(body);
    const currentBuyer = await getBuyer(id);
    
    if (!currentBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }
    
    const buyer = await updateBuyer(id, validatedData, user.id, currentBuyer);
    
    return NextResponse.json(buyer);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const user = await requireAuth();
    await deleteBuyer(id, user.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
