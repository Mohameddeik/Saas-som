import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/Layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatData } from '@/lib/utils'
import {
  Wallet,
  Database,
  TrendingUp,
  Clock,
  ArrowRight,
  ShoppingBag,
  Receipt,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      transactions: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      dataPurchases: {
        take: 3,
        where: {
          expiresAt: { gte: new Date() },
        },
        orderBy: { expiresAt: 'asc' },
        include: {
          bundle: true,
        },
      },
    },
  })

  return user
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userData = await getUserData(session.user.id)

  if (!userData) {
    redirect('/auth/login')
  }

  const balance = Number(userData.balance)
  const dataBalance = Number(userData.dataBalance)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userData.name}!</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="gradient-bg text-white overflow-hidden relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Account Balance</CardTitle>
                <Wallet className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">
                {formatCurrency(balance)}
              </div>
              <Link href="/topup">
                <Button variant="secondary" size="sm">
                  Top Up Now
                </Button>
              </Link>
            </CardContent>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Wallet className="h-40 w-40" />
            </div>
          </Card>

          <Card className="bg-blue-600 text-white overflow-hidden relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Data Balance</CardTitle>
                <Database className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">
                {formatData(dataBalance)}
              </div>
              <Link href="/bundles">
                <Button variant="secondary" size="sm">
                  Buy Data
                </Button>
              </Link>
            </CardContent>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Database className="h-40 w-40" />
            </div>
          </Card>
        </div>

        {/* Active Data Bundles */}
        {userData.dataPurchases.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Data Bundles</CardTitle>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData.dataPurchases.map((purchase) => {
                  const daysLeft = Math.ceil(
                    (new Date(purchase.expiresAt).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {purchase.bundle.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatData(Number(purchase.dataAmount))} • Expires in {daysLeft} days
                        </p>
                      </div>
                      <div className="text-emerald-600 font-semibold">
                        Active
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/bundles">
                <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <p className="font-medium text-gray-900">Buy Data</p>
                </div>
              </Link>
              <Link href="/topup">
                <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer text-center">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <p className="font-medium text-gray-900">Top Up</p>
                </div>
              </Link>
              <Link href="/transactions">
                <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer text-center">
                  <Receipt className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <p className="font-medium text-gray-900">History</p>
                </div>
              </Link>
              <Link href="/profile">
                <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <p className="font-medium text-gray-900">Profile</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userData.transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userData.transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(Number(transaction.amount))}
                      </p>
                      <p className={`text-sm ${
                        transaction.status === 'COMPLETED'
                          ? 'text-emerald-600'
                          : transaction.status === 'PENDING'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
