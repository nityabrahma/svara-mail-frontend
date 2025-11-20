'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const emailSchema = z.object({
  email: z.string().min(1, { message: 'Please enter your email or username.' }),
})

const passwordSchema = z.object({
  password: z.string().min(1, { message: 'Password is required.' }),
})

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 170.8 57.2l-66.8 65.2C314.5 98 283.5 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406 248 406c58.3 0 108.3-33.5 131.3-79.3h-131.3v-86.2h240.2c2.5 14.5 4.9 29.8 4.9 46.1z"></path>
    </svg>
);


export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = React.useState<'email' | 'password'>('email')
  const [email, setEmail] = React.useState('')

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  })

  function onEmailSubmit(values: z.infer<typeof emailSchema>) {
    // Mock verification
    if (values.email) {
        setEmail(values.email)
        setStep('password')
    } else {
        toast({
            variant: 'destructive',
            title: 'Invalid Input',
            description: 'Please enter a valid email or username.',
        })
    }
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if (email === 'test@example.com' && values.password === 'password') {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your inbox...',
      })
      router.push('/inbox')
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Credentials',
        description: 'Please check your email and password.',
      })
    }
  }
  
  const handleBack = () => {
    setStep('email');
    passwordForm.reset();
  }

  if (step === 'password') {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-2 mb-4">
                <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  &larr; Back
                </button>
                <p className="font-semibold truncate">{email}</p>
            </div>
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} autoFocus />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full rounded-[30px] p-8" size="lg">
                        Sign In
                    </Button>
                </form>
            </Form>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                        <Input placeholder="username@svaramail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full rounded-[30px] p-8" size="lg">
                Continue
                </Button>
            </form>
        </Form>
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                OR
                </span>
            </div>
        </div>
        <Button variant="outline" className="w-full rounded-[30px] p-8" size="lg">
           <GoogleIcon />
            Continue with Google
        </Button>
    </div>
  )
}
