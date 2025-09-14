import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { updateBuyer, deleteBuyer, getBuyerById } from '@/lib/buyer-utils';
import { BuyerFormSchema } from '@/lib/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const buyer = await getBuyerById(params.id, user.id);
    
    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = BuyerFormSchema.partial().parse(body);
    
    // Get current buyer data for history tracking
    const currentBuyer = await getBuyerById(params.id, user.id);
    if (!currentBuyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }
    
    const buyer = await updateBuyer(params.id, validatedData, user.id, currentBuyer);
    
    return NextResponse.json(buyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    
    // Check if buyer exists and belongs to user
    const buyer = await getBuyerById(params.id, user.id);
    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }
    
    await deleteBuyer(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}