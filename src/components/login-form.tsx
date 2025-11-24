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
import { useAuth } from '@/hooks/use-auth'

const emailSchema = z.object({
    credential: z.string().min(1, { message: 'Please enter your email or username.' }),
})

const passwordSchema = z.object({
    password: z.string().min(1, { message: 'Password is required.' }),
})

const signupSchema = z.object({
    phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const otpSchema = z.object({
    otp: z.string().length(6, { message: 'OTP must be 6 digits.' }),
})


const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 170.8 57.2l-66.8 65.2C314.5 98 283.5 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406 248 406c58.3 0 108.3-33.5 131.3-79.3h-131.3v-86.2h240.2c2.5 14.5 4.9 29.8 4.9 46.1z"></path>
    </svg>
);


export function LoginForm() {
    const router = useRouter()
    const { toast } = useToast()
    const auth = useAuth();
    const [step, setStep] = React.useState<'email' | 'password' | 'signup' | 'otp'>('email')
    const [credential, setCredential] = React.useState('')

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { credential: '' },
    })

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '' },
    })

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { phone: '', password: '', confirmPassword: '' },
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    })

    async function onEmailSubmit(values: z.infer<typeof emailSchema>) {
        try {
            let isAvailable;
            const isEmail = values.credential.includes('@');

            if (isEmail) {
                isAvailable = await auth.checkDomainEmail(values.credential);
            } else {
                isAvailable = await auth.checkUsername(values.credential);
            }

            setCredential(values.credential);
            if (isAvailable) {
                setStep('signup');
            } else {
                setStep('password');
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'An unexpected error occurred.',
            })
        }
    }

    function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
        // Mock password check
        if (values.password === 'password') {
            toast({
                title: 'Login Successful',
                description: 'Redirecting to your inbox...',
            })
            router.push('/inbox')
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid Credentials',
                description: 'Please check your password.',
            })
        }
    }

    function onSignupSubmit(values: z.infer<typeof signupSchema>) {
        // Mock signup logic
        console.log('Signing up with:', values);
        setStep('otp');
        toast({
            title: 'OTP Sent',
            description: 'An OTP has been sent to your phone number.',
        })
    }

    function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        // Mock OTP verification
        if (values.otp === '123456') {
            toast({
                title: 'Signup Successful!',
                description: 'Redirecting to your inbox...',
            })
            router.push('/inbox');
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid OTP',
                description: 'The OTP you entered is incorrect.',
            })
        }
    }

    const handleBack = () => {
        setStep('email');
        passwordForm.reset();
        signupForm.reset();
        otpForm.reset();
    }

   if (step === 'otp') {
    return (
        <div key="otp-form" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => setStep('signup')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    &larr; Back
                </button>
                <p className="font-semibold truncate">{credential}</p>
            </div>

            <p className="text-center text-muted-foreground">
                Enter the 6-digit code sent to your phone.
            </p>

            <Form {...otpForm}>
                <form
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="123456"
                                        autoFocus
                                        {...field}   // ✅ FIXED — now the form works
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full rounded-[30px] p-8 text-white text-lg font-bold"
                        size="lg"
                    >
                        Verify
                    </Button>
                </form>
            </Form>
        </div>
    )
}


    if (step === 'signup') {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        &larr; Back
                    </button>
                    <p className="font-semibold truncate">{credential}</p>
                </div>
                <h3 className="text-xl font-semibold text-center">Create your account</h3>
                <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                        <FormField
                            control={signupForm.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="Your phone number" {...field} autoFocus />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Create a password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full rounded-[30px] p-8 text-white text-lg font-bold" size="lg">
                            Sign Up
                        </Button>
                    </form>
                </Form>
            </div>
        )
    }

    if (step === 'password') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        &larr; Back
                    </button>
                    <p className="font-semibold truncate">{credential}</p>
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
                        <Button type="submit" className="w-full rounded-[30px] p-8 text-white text-lg font-bold" size="lg">
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
                        name="credential"
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
                    <Button type="submit" className="w-full rounded-[30px] p-8 text-white text-lg font-bold" size="lg">
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
            <Button variant="white" className="w-full rounded-[30px] p-8" size="lg">
                <GoogleIcon />
                Continue with Google
            </Button>
        </div>
    )
}
