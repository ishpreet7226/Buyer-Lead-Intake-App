import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createBuyersFromCSV } from '@/lib/buyer-utils';
import { CSVBuyerSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    if (!body.buyers || !Array.isArray(body.buyers)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (body.buyers.length > 200) {
      return NextResponse.json({ error: 'Too many buyers. Maximum 200 allowed.' }, { status: 400 });
    }

    // Validate all buyers first
    const validatedBuyers = [];
    const validationErrors = [];

    for (let i = 0; i < body.buyers.length; i++) {
      try {
        const validated = CSVBuyerSchema.parse(body.buyers[i]);
        validatedBuyers.push(validated);
      } catch (error) {
        validationErrors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Validation error'
        });
      }
    }

    if (validatedBuyers.length === 0) {
      return NextResponse.json({
        success: [],
        errors: validationErrors
      });
    }

    // Import valid buyers
    const results = await createBuyersFromCSV(validatedBuyers, user.id);
    
    return NextResponse.json({
      success: results.success,
      errors: [...validationErrors, ...results.errors]
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
