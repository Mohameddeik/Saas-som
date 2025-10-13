'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatData } from '@/lib/utils'
import { Database, Clock, Star } from 'lucide-react'
import { DataBundle } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface BundleCardProps {
  bundle: DataBundle
}

export function BundleCard({ bundle }: BundleCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bundles/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundleId: bundle.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Purchase failed')
      }

      // Redirect to dashboard or show success message
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Failed to purchase bundle')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={bundle.isFeatured ? 'border-2 border-emerald-500 relative' : ''}>
      {bundle.isFeatured && (
        <div className="absolute -top-3 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star className="h-3 w-3" />
          POPULAR
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{bundle.name}</CardTitle>
            {bundle.description && (
              <p className="text-sm text-gray-600 mt-1">{bundle.description}</p>
            )}
          </div>
          <Database className="h-8 w-8 text-emerald-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {formatData(Number(bundle.dataAmount))}
              </p>
              <p className="text-sm text-gray-600 mt-1">Data Included</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{bundle.validity} days validity</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Price:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(Number(bundle.price))}
              </span>
            </div>
            <Button
              onClick={handlePurchase}
              disabled={isLoading}
              className="w-full"
              variant={bundle.isFeatured ? 'primary' : 'primary'}
            >
              {isLoading ? 'Processing...' : 'Purchase Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
