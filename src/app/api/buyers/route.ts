import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createBuyer } from '@/lib/buyer-utils';
import { BuyerFormSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = BuyerFormSchema.parse(body);
    
    const buyer = await createBuyer(validatedData, user.id);
    
    return NextResponse.json(buyer, { status: 201 });
  } catch (error) {
    console.error('Error creating buyer:', error);
    
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