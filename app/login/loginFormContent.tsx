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
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
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
        setRemainingAttempts(null)
        startTransition(async () => {
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    username,
                    password,
                })

                if (result?.error) {
                    try {
                        console.log(result.error);
                        const errorData = JSON.parse(result.error);
                        if (errorData.type === 'rate_limit') {
                            setError(errorData.message);
                            setRemainingAttempts(errorData.remainingAttempts);
                        } else if (errorData.type === 'auth_error') {
                            setError(errorData.message);
                            setRemainingAttempts(errorData.remainingAttempts);
                        } else {
                            setError('予期しないエラーが発生しました');
                        }
                    } catch {
                        setError('予期しないエラーが発生しました');
                    }
                }
            } catch (error) {
                console.error('Login error:', error)
                setError('予期しないエラーが発生しました')
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
            {error && (
                <div id="login-error" className="text-red-500 text-sm" role="alert">
                    <p>{error}</p>
                    {remainingAttempts !== null && (
                        <p>ログイン試行ロックまで、あと {remainingAttempts}回</p>
                    )}
                </div>
            )}
            <SubmitButton submitButtonContent={submitButtonContent}></SubmitButton>
        </form>
    )
}