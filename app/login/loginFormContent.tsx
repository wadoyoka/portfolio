'use client'

import SubmitButton from "@/components/elements/SubmitButton/SubmitButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

export default function LoginFormContent() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition();
    const { status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const submitButtonContent = {
        preText: "ログイン",
        postText: "ログイン中",
        ispending: isPending
    }

    useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl);
        }
    }, [status, router, callbackUrl])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        startTransition(async () => {
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    username,
                    password,
                })

                if (result?.error) {
                    setError('Invalid username or password')
                }
            } catch (error) {
                console.error('Login error:', error)
                setError('An error occurred during login')
            }
        })
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    aria-describedby="username-error"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-describedby="password-error"
                />
            </div>
            {error && <p id="login-error" className="text-red-500 text-sm" role="alert">{error}</p>}
            <SubmitButton submitButtonContent={submitButtonContent}></SubmitButton>
        </form>
    )
}