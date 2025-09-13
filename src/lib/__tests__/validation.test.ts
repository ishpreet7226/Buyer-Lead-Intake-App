import { BuyerFormSchema, CSVBuyerSchema } from '../schemas';

describe('Buyer Validation', () => {
  describe('BuyerFormSchema', () => {
    it('should validate a complete buyer form', () => {
      const validBuyer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'Two',
        purpose: 'Buy',
        budgetMin: 5000000,
        budgetMax: 8000000,
        timeline: 'ZeroToThree',
        source: 'Website',
        notes: 'Interested in 2BHK apartment',
        tags: 'premium,urgent',
      };

      const result = BuyerFormSchema.safeParse(validBuyer);
      expect(result.success).toBe(true);
    });

    it('should require BHK for Apartment property type', () => {
      const buyerWithoutBHK = {
        fullName: 'John Doe',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        purpose: 'Buy',
        timeline: 'ZeroToThree',
        source: 'Website',
      };

      const result = BuyerFormSchema.safeParse(buyerWithoutBHK);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('bhk');
      }
    });

    it('should not require BHK for Plot property type', () => {
      const buyerWithoutBHK = {
        fullName: 'John Doe',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Plot',
        purpose: 'Buy',
        timeline: 'ZeroToThree',
        source: 'Website',
      };

      const result = BuyerFormSchema.safeParse(buyerWithoutBHK);
      expect(result.success).toBe(true);
    });

    it('should validate budget constraints', () => {
      const buyerWithInvalidBudget = {
        fullName: 'John Doe',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'Two',
        purpose: 'Buy',
        budgetMin: 8000000,
        budgetMax: 5000000, // Max is less than min
        timeline: 'ZeroToThree',
        source: 'Website',
      };

      const result = BuyerFormSchema.safeParse(buyerWithInvalidBudget);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('budgetMax');
      }
    });

    it('should validate phone number format', () => {
      const buyerWithInvalidPhone = {
        fullName: 'John Doe',
        phone: '123', // Too short
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'Two',
        purpose: 'Buy',
        timeline: 'ZeroToThree',
        source: 'Website',
      };

      const result = BuyerFormSchema.safeParse(buyerWithInvalidPhone);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('phone');
      }
    });

    it('should allow empty email', () => {
      const buyerWithEmptyEmail = {
        fullName: 'John Doe',
        email: '',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'Two',
        purpose: 'Buy',
        timeline: 'ZeroToThree',
        source: 'Website',
      };

      const result = BuyerFormSchema.safeParse(buyerWithEmptyEmail);
      expect(result.success).toBe(true);
    });
  });

  describe('CSVBuyerSchema', () => {
    it('should validate CSV data with string transformations', () => {
      const csvData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: 'Two',
        purpose: 'Buy',
        budgetMin: '5000000',
        budgetMax: '8000000',
        timeline: 'ZeroToThree',
        source: 'Website',
        notes: 'Interested in 2BHK',
        tags: 'premium,urgent',
        status: 'New',
      };

      const result = CSVBuyerSchema.safeParse(csvData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.budgetMin).toBe('number');
        expect(typeof result.data.budgetMax).toBe('number');
      }
    });

    it('should handle empty string values in CSV', () => {
      const csvData = {
        fullName: 'John Doe',
        email: '',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '',
        purpose: 'Buy',
        budgetMin: '',
        budgetMax: '',
        timeline: 'ZeroToThree',
        source: 'Website',
        notes: '',
        tags: '',
        status: 'New',
      };

      const result = CSVBuyerSchema.safeParse(csvData);
      expect(result.success).toBe(false); // Should fail because BHK is required for Apartment
    });
  });
});
