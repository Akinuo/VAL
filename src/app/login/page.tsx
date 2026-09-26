import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Sign in or create a free account to save your lesson progress.',
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-denim/20 border-t-denim" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
