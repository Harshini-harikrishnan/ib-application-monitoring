'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'

type LoginFormInputs = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      console.log('Login attempt:', data)
      // TODO: Send data to your .NET backend (e.g. via fetch or axios)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
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

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="flex justify-between mt-4 text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
            <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}