import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon/20 border-t-maroon" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
