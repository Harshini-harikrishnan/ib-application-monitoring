'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const router = useRouter()

// After success
router.push('/login')

type ForgotFormInputs = {
  email: string
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotFormInputs>()

  const onSubmit = async (data: ForgotFormInputs) => {
    console.log('Forgot Password Request:', data)
    // TODO: Send email to .NET endpoint for password reset
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="flex justify-center mt-4 text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">Back to Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}