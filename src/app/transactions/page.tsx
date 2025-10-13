import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/Layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Receipt, TrendingUp, TrendingDown, Filter } from 'lucide-react'

async function getTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return transactions
}

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const transactions = await getTransactions(session.user.id)

  // Calculate statistics
  const totalTopups = transactions
    .filter((t) => t.type === 'TOPUP' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalSpent = transactions
    .filter(
      (t) =>
        (t.type === 'DATA_PURCHASE' || t.type === 'SERVICE_SUBSCRIPTION') &&
        t.status === 'COMPLETED'
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="h-8 w-8 text-emerald-600" />
            Transaction History
          </h1>
          <p className="text-gray-600 mt-1">View all your transactions and purchases</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Top-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalTopups)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalSpent)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Transactions</CardTitle>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const isIncoming = transaction.type === 'TOPUP' || transaction.type === 'REFUND'
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg ${
                            isIncoming ? 'bg-green-100' : 'bg-blue-100'
                          }`}
                        >
                          {isIncoming ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.description || transaction.type.replace('_', ' ')}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-600">
                              {formatDate(transaction.createdAt)}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-gray-500">
                              {transaction.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            isIncoming ? 'text-green-600' : 'text-gray-900'
                          }`}
                        >
                          {isIncoming ? '+' : '-'}
                          {formatCurrency(Number(transaction.amount))}
                        </p>
                        <p
                          className={`text-xs ${
                            transaction.status === 'COMPLETED'
                              ? 'text-green-600'
                              : transaction.status === 'PENDING'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
