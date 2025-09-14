import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleUsers = [
  {
    email: 'john.doe@realestate.com',
    name: 'John Doe',
  },
  {
    email: 'sarah.smith@realestate.com',
    name: 'Sarah Smith',
  },
  {
    email: 'mike.johnson@realestate.com',
    name: 'Mike Johnson',
  },
];

const sampleBuyers = [
  {
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: 'Three',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 8000000,
    timeline: 'ZeroToThree',
    source: 'Website',
    status: 'New',
    notes: 'Looking for a 3BHK apartment in Sector 17 or nearby areas. Prefers modern amenities and good connectivity.',
    tags: 'premium,urgent,first-time-buyer',
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '9876543211',
    city: 'Mohali',
    propertyType: 'Villa',
    bhk: 'Four',
    purpose: 'Buy',
    budgetMin: 12000000,
    budgetMax: 15000000,
    timeline: 'ThreeToSix',
    source: 'Referral',
    status: 'Qualified',
    notes: 'Interested in luxury villa with garden space. Budget is flexible for the right property.',
    tags: 'luxury,high-budget,family',
  },
  {
    fullName: 'Amit Singh',
    email: 'amit.singh@outlook.com',
    phone: '9876543212',
    city: 'Zirakpur',
    propertyType: 'Plot',
    purpose: 'Buy',
    budgetMin: 3000000,
    budgetMax: 5000000,
    timeline: 'MoreThanSix',
    source: 'WalkIn',
    status: 'Contacted',
    notes: 'Looking for residential plot for future construction. Prefers corner plot with good road access.',
    tags: 'plot,investment,corner-plot',
  },
  {
    fullName: 'Neha Gupta',
    email: 'neha.gupta@gmail.com',
    phone: '9876543213',
    city: 'Panchkula',
    propertyType: 'Apartment',
    bhk: 'Two',
    purpose: 'Rent',
    budgetMin: 15000,
    budgetMax: 25000,
    timeline: 'ZeroToThree',
    source: 'Call',
    status: 'Visited',
    notes: 'Looking for 2BHK rental apartment. Prefers furnished or semi-furnished. Need parking space.',
    tags: 'rental,furnished,parking',
  },
  {
    fullName: 'Vikram Mehta',
    email: 'vikram.mehta@company.com',
    phone: '9876543214',
    city: 'Chandigarh',
    propertyType: 'Office',
    purpose: 'Buy',
    budgetMin: 8000000,
    budgetMax: 12000000,
    timeline: 'ThreeToSix',
    source: 'Website',
    status: 'Negotiation',
    notes: 'Looking for office space in IT Park or similar commercial area. Need at least 2000 sq ft.',
    tags: 'commercial,office,it-park',
  },
  {
    fullName: 'Sunita Reddy',
    email: 'sunita.reddy@gmail.com',
    phone: '9876543215',
    city: 'Mohali',
    propertyType: 'Retail',
    purpose: 'Rent',
    budgetMin: 30000,
    budgetMax: 50000,
    timeline: 'ZeroToThree',
    source: 'Other',
    status: 'Converted',
    notes: 'Looking for retail space for clothing store. Prefers high footfall area with good visibility.',
    tags: 'retail,high-footfall,clothing',
  },
  {
    fullName: 'Arjun Patel',
    email: 'arjun.patel@email.com',
    phone: '9876543216',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: 'One',
    purpose: 'Buy',
    budgetMin: 2500000,
    budgetMax: 4000000,
    timeline: 'Exploring',
    source: 'Website',
    status: 'New',
    notes: 'First-time buyer looking for 1BHK apartment. Budget is tight but flexible for good location.',
    tags: 'first-time-buyer,budget,1bhk',
  },
  {
    fullName: 'Kavita Joshi',
    email: 'kavita.joshi@yahoo.com',
    phone: '9876543217',
    city: 'Zirakpur',
    propertyType: 'Villa',
    bhk: 'Three',
    purpose: 'Buy',
    budgetMin: 8000000,
    budgetMax: 10000000,
    timeline: 'ThreeToSix',
    source: 'Referral',
    status: 'Qualified',
    notes: 'Looking for 3BHK villa with modern amenities. Prefers gated community with security.',
    tags: 'villa,gated-community,security',
  },
  {
    fullName: 'Rohit Verma',
    email: 'rohit.verma@gmail.com',
    phone: '9876543218',
    city: 'Panchkula',
    propertyType: 'Apartment',
    bhk: 'Two',
    purpose: 'Rent',
    budgetMin: 12000,
    budgetMax: 20000,
    timeline: 'ZeroToThree',
    source: 'Call',
    status: 'Dropped',
    notes: 'Was looking for 2BHK rental but found something else. May contact again in future.',
    tags: 'rental,2bhk,short-term',
  },
  {
    fullName: 'Deepika Singh',
    email: 'deepika.singh@company.com',
    phone: '9876543219',
    city: 'Chandigarh',
    propertyType: 'Office',
    purpose: 'Rent',
    budgetMin: 40000,
    budgetMax: 60000,
    timeline: 'ZeroToThree',
    source: 'Website',
    status: 'Visited',
    notes: 'Looking for office space for startup. Need flexible terms and good internet connectivity.',
    tags: 'startup,office,flexible',
  },
  {
    fullName: 'Suresh Kumar',
    email: 'suresh.kumar@email.com',
    phone: '9876543220',
    city: 'Mohali',
    propertyType: 'Plot',
    purpose: 'Buy',
    budgetMin: 4000000,
    budgetMax: 6000000,
    timeline: 'MoreThanSix',
    source: 'WalkIn',
    status: 'Contacted',
    notes: 'Looking for residential plot for investment. Prefers area with good development potential.',
    tags: 'investment,plot,development',
  },
  {
    fullName: 'Anita Sharma',
    email: 'anita.sharma@gmail.com',
    phone: '9876543221',
    city: 'Zirakpur',
    propertyType: 'Apartment',
    bhk: 'Four',
    purpose: 'Buy',
    budgetMin: 6000000,
    budgetMax: 9000000,
    timeline: 'ThreeToSix',
    source: 'Referral',
    status: 'Negotiation',
    notes: 'Looking for 4BHK apartment for large family. Prefers top floor with good view.',
    tags: 'family,4bhk,top-floor',
  },
  {
    fullName: 'Manoj Tiwari',
    email: 'manoj.tiwari@yahoo.com',
    phone: '9876543222',
    city: 'Chandigarh',
    propertyType: 'Retail',
    purpose: 'Buy',
    budgetMin: 15000000,
    budgetMax: 20000000,
    timeline: 'MoreThanSix',
    source: 'Other',
    status: 'New',
    notes: 'Looking for retail space for electronics store. Prefers main market area with high visibility.',
    tags: 'retail,electronics,main-market',
  },
  {
    fullName: 'Pooja Agarwal',
    email: 'pooja.agarwal@gmail.com',
    phone: '9876543223',
    city: 'Panchkula',
    propertyType: 'Apartment',
    bhk: 'Studio',
    purpose: 'Rent',
    budgetMin: 8000,
    budgetMax: 15000,
    timeline: 'ZeroToThree',
    source: 'Website',
    status: 'Qualified',
    notes: 'Looking for studio apartment for single occupancy. Prefers furnished with basic amenities.',
    tags: 'studio,single,furnished',
  },
  {
    fullName: 'Ravi Malhotra',
    email: 'ravi.malhotra@company.com',
    phone: '9876543224',
    city: 'Mohali',
    propertyType: 'Villa',
    bhk: 'Two',
    purpose: 'Buy',
    budgetMin: 7000000,
    budgetMax: 10000000,
    timeline: 'Exploring',
    source: 'Call',
    status: 'Contacted',
    notes: 'Looking for 2BHK villa with garden. Prefers peaceful location away from main road.',
    tags: 'villa,garden,peaceful',
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create users
  console.log('👥 Creating users...');
  const users = [];
  for (const userData of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // Create buyers
  console.log('🏠 Creating buyers...');
  const buyers = [];
  for (const buyerData of sampleBuyers) {
    // Assign random user as owner
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    const buyer = await prisma.buyer.create({
      data: {
        ...buyerData,
        ownerId: randomUser.id,
      },
    });
    buyers.push(buyer);
  }
  console.log(`✅ Created ${buyers.length} buyers`);

  // Create some buyer history entries
  console.log('📝 Creating buyer history...');
  for (let i = 0; i < buyers.length; i++) {
    const buyer = buyers[i];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    // Create 1-3 history entries per buyer
    const historyCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < historyCount; j++) {
      await prisma.buyerHistory.create({
        data: {
          buyerId: buyer.id,
          changedBy: randomUser.id,
          diff: {
            action: j === 0 ? 'created' : 'updated',
            fields: j === 0 ? {
              status: { from: null, to: buyer.status }
            } : {
              status: { 
                from: ['New', 'Qualified', 'Contacted'][Math.floor(Math.random() * 3)], 
                to: buyer.status 
              }
            },
          },
        },
      });
    }
  }
  console.log('✅ Created buyer history entries');

  console.log('🎉 Seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Buyers: ${buyers.length}`);
  console.log(`   - History entries: ${await prisma.buyerHistory.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
