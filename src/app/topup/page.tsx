'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/Layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CreditCard, Smartphone, Building2, Wallet } from 'lucide-react'

const quickAmounts = [5, 10, 20, 50, 100]

const paymentMethods = [
  { id: 'ZAAD', name: 'Zaad Service', icon: Smartphone },
  { id: 'EVCPLUS', name: 'EVC Plus', icon: Smartphone },
  { id: 'EDAHAB', name: 'eDahab', icon: Wallet },
  { id: 'CARD', name: 'Credit/Debit Card', icon: CreditCard },
]

export default function TopUpPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('ZAAD')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!phoneNumber && paymentMethod !== 'CARD') {
      setError('Please enter your phone number')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethod,
          phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Top-up failed')
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Failed to process top-up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wallet className="h-8 w-8 text-emerald-600" />
            Top Up Account
          </h1>
          <p className="text-gray-600 mt-1">Add money to your account balance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Select
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {quickAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                        amount === value.toString()
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      ${value}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Or Enter Custom Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <Icon className="h-6 w-6 text-emerald-600" />
                        <span className="font-medium">{method.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {paymentMethod !== 'CARD' && (
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="252XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${amount || '0.00'}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ${amount || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete Top-Up'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Top-up is instant and will reflect in your account immediately</li>
            <li>• Minimum top-up amount is $1</li>
            <li>• All transactions are secure and encrypted</li>
            <li>• Contact support if you face any issues</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
