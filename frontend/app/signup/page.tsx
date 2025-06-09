'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const router = useRouter()

// After success
router.push('/login')

type SignUpFormInputs = {
  name: string
  email: string
  password: string
}

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormInputs>()

  const onSubmit = async (data: SignUpFormInputs) => {
    console.log('Sign Up:', data)
    // TODO: POST to .NET signup endpoint
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="pl-10"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

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
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="flex justify-center mt-4 text-sm">
            Already have an account?&nbsp;
            <Link href="/login" className="text-blue-600 hover:underline">Log In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}