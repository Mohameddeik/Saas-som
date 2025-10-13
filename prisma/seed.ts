import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { phone: '252612345678' },
    update: {},
    create: {
      phone: '252612345678',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      password: hashedPassword,
      balance: 50,
      dataBalance: 1024, // 1 GB
      phoneVerified: new Date(),
      isActive: true,
    },
  })

  console.log('✅ Created demo user:', user.phone)

  // Create data bundles
  const bundles = [
    // Daily bundles
    {
      name: 'Daily Starter',
      description: 'Perfect for light browsing',
      dataAmount: 100, // 100 MB
      price: 1,
      validity: 1,
      category: 'DAILY' as const,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Daily Pro',
      description: 'Great for social media',
      dataAmount: 500, // 500 MB
      price: 2,
      validity: 1,
      category: 'DAILY' as const,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Daily Max',
      description: 'Stream and browse all day',
      dataAmount: 1024, // 1 GB
      price: 3,
      validity: 1,
      category: 'DAILY' as const,
      isActive: true,
      isFeatured: false,
    },
    // Weekly bundles
    {
      name: 'Weekly Basic',
      description: '7 days of connectivity',
      dataAmount: 2048, // 2 GB
      price: 5,
      validity: 7,
      category: 'WEEKLY' as const,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Weekly Plus',
      description: 'More data for a week',
      dataAmount: 5120, // 5 GB
      price: 10,
      validity: 7,
      category: 'WEEKLY' as const,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Weekly Ultra',
      description: 'Maximum weekly data',
      dataAmount: 10240, // 10 GB
      price: 15,
      validity: 7,
      category: 'WEEKLY' as const,
      isActive: true,
      isFeatured: false,
    },
    // Monthly bundles
    {
      name: 'Monthly Lite',
      description: '30 days of basic data',
      dataAmount: 10240, // 10 GB
      price: 20,
      validity: 30,
      category: 'MONTHLY' as const,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Monthly Standard',
      description: 'Best value for regular users',
      dataAmount: 20480, // 20 GB
      price: 35,
      validity: 30,
      category: 'MONTHLY' as const,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Monthly Premium',
      description: 'Unlimited streaming & browsing',
      dataAmount: 51200, // 50 GB
      price: 50,
      validity: 30,
      category: 'MONTHLY' as const,
      isActive: true,
      isFeatured: false,
    },
    // Special offers
    {
      name: 'Night Owl',
      description: 'Unlimited data from 12 AM - 6 AM',
      dataAmount: 5120, // 5 GB
      price: 5,
      validity: 7,
      category: 'SPECIAL' as const,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Weekend Blast',
      description: 'Friday-Sunday special',
      dataAmount: 7168, // 7 GB
      price: 8,
      validity: 3,
      category: 'SPECIAL' as const,
      isActive: true,
      isFeatured: false,
    },
  ]

  for (const bundle of bundles) {
    await prisma.dataBundle.upsert({
      where: {
        // Use a combination that makes sense for your unique constraint
        id: `${bundle.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
      update: {},
      create: bundle,
    })
  }

  console.log('✅ Created data bundles')

  // Create some sample transactions
  const transactions = [
    {
      userId: user.id,
      type: 'TOPUP' as const,
      amount: 50,
      status: 'COMPLETED' as const,
      paymentMethod: 'ZAAD' as const,
      description: 'Account top-up via ZAAD',
      balanceBefore: 0,
      balanceAfter: 50,
      reference: 'TXN-001',
    },
    {
      userId: user.id,
      type: 'DATA_PURCHASE' as const,
      amount: 10,
      status: 'COMPLETED' as const,
      paymentMethod: 'ZAAD' as const,
      description: 'Purchased Weekly Plus',
      balanceBefore: 50,
      balanceAfter: 40,
      reference: 'TXN-002',
    },
  ]

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    })
  }

  console.log('✅ Created sample transactions')

  // Create service plans
  const servicePlans = [
    {
      name: 'Voice Basic',
      description: '100 minutes for local calls',
      price: 5,
      features: ['100 minutes', 'Local calls only', '7 days validity'],
      validity: 7,
      planType: 'VOICE' as const,
      isActive: true,
    },
    {
      name: 'SMS Bundle',
      description: '500 SMS to any network',
      price: 3,
      features: ['500 SMS', 'All networks', '30 days validity'],
      validity: 30,
      planType: 'SMS' as const,
      isActive: true,
    },
    {
      name: 'Combo Pack',
      description: 'Voice, SMS and Data in one',
      price: 15,
      features: ['200 minutes', '200 SMS', '2 GB data', '30 days validity'],
      validity: 30,
      planType: 'COMBO' as const,
      isActive: true,
    },
  ]

  for (const plan of servicePlans) {
    await prisma.servicePlan.create({
      data: plan,
    })
  }

  console.log('✅ Created service plans')

  console.log('🎉 Database seeding completed!')
  console.log('\n📱 Demo Login Credentials:')
  console.log('Phone: 252612345678')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
