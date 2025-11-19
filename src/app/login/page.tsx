import { LoginForm } from '@/components/login-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <Mail className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-4xl font-bold text-primary">ReactMail</CardTitle>
          </div>
          <CardDescription className="text-lg">Welcome back! Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
