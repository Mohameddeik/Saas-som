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

    const { amount, paymentMethod, phoneNumber } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // In a real app, you would integrate with payment gateway here
    // For demo purposes, we'll simulate a successful payment

    // Create transaction and update balance
    const result = await prisma.$transaction([
      // Create transaction record
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: 'TOPUP',
          amount,
          status: 'COMPLETED',
          paymentMethod,
          description: `Account top-up via ${paymentMethod}`,
          balanceBefore: user.balance,
          balanceAfter: Number(user.balance) + Number(amount),
          reference: `TXN-${Date.now()}`,
        },
      }),
      // Update user balance
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          balance: Number(user.balance) + Number(amount),
        },
      }),
    ])

    return NextResponse.json({
      message: 'Top-up successful',
      transaction: result[0],
      newBalance: Number(user.balance) + Number(amount),
    })
  } catch (error) {
    console.error('Top-up error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
