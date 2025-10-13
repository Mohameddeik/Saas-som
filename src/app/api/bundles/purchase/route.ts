import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bundleId } = await request.json()

    if (!bundleId) {
      return NextResponse.json({ error: 'Bundle ID is required' }, { status: 400 })
    }

    // Get bundle details
    const bundle = await prisma.dataBundle.findUnique({
      where: { id: bundleId },
    })

    if (!bundle || !bundle.isActive) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
    }

    // Get user balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has sufficient balance
    if (Number(user.balance) < Number(bundle.price)) {
      return NextResponse.json(
        { error: 'Insufficient balance. Please top up your account.' },
        { status: 400 }
      )
    }

    // Calculate expiry date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + bundle.validity)

    // Create purchase and update balances in a transaction
    const result = await prisma.$transaction([
      // Create data purchase record
      prisma.dataPurchase.create({
        data: {
          userId: session.user.id,
          bundleId: bundle.id,
          amount: bundle.price,
          dataAmount: bundle.dataAmount,
          expiresAt,
          status: 'COMPLETED',
        },
      }),
      // Create transaction record
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: 'DATA_PURCHASE',
          amount: bundle.price,
          status: 'COMPLETED',
          paymentMethod: 'ZAAD',
          description: `Purchased ${bundle.name}`,
          balanceBefore: user.balance,
          balanceAfter: Number(user.balance) - Number(bundle.price),
        },
      }),
      // Update user balances
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          balance: Number(user.balance) - Number(bundle.price),
          dataBalance: Number(user.dataBalance) + Number(bundle.dataAmount),
        },
      }),
    ])

    return NextResponse.json({
      message: 'Bundle purchased successfully',
      purchase: result[0],
    })
  } catch (error) {
    console.error('Bundle purchase error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
