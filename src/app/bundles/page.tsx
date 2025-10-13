import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/Layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { BundleCard } from '@/components/BundleCard'
import { Database, Zap } from 'lucide-react'

async function getDataBundles() {
  const bundles = await prisma.dataBundle.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })
  return bundles
}

async function getUserBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true, dataBalance: true },
  })
  return user
}

export default async function BundlesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const bundles = await getDataBundles()
  const user = await getUserBalance(session.user.id)

  // Group bundles by category
  const daily = bundles.filter((b) => b.category === 'DAILY')
  const weekly = bundles.filter((b) => b.category === 'WEEKLY')
  const monthly = bundles.filter((b) => b.category === 'MONTHLY')
  const special = bundles.filter((b) => b.category === 'SPECIAL')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-emerald-600" />
            Buy Data Bundles
          </h1>
          <p className="text-gray-600 mt-1">Choose the perfect plan for your needs</p>
        </div>

        {/* User Balance Banner */}
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Your Balance</p>
                <p className="text-2xl font-bold">
                  ${Number(user?.balance || 0).toFixed(2)}
                </p>
              </div>
              <Zap className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Bundles */}
        {daily.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daily.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </div>
        )}

        {/* Weekly Bundles */}
        {weekly.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weekly.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </div>
        )}

        {/* Monthly Bundles */}
        {monthly.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthly.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </div>
        )}

        {/* Special Offers */}
        {special.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Special Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {special.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </div>
        )}

        {bundles.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Database className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No data bundles available at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
