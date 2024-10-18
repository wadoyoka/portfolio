'use client'

import SubmitButton from "@/components/elements/SubmitButton/SubmitButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, useSession } from 'next-auth/react'
import { SetStateAction, useCallback, useEffect, useState, useTransition } from 'react'

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [isPending, startTransition] = useTransition();
    const { status } = useSession()

    const submitButtonContent = {
        preText: "ログイン",
        postText: "ログイン中",
        ispending: isPending
    }

    const handleRedirect = useCallback(() => {
        if (status === 'authenticated') {
            window.location.href = '/'
        }
    }, [status])

    useEffect(() => {
        handleRedirect()
    }, [handleRedirect])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md bg-white max-md:mx-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e: { target: { value: SetStateAction<string> } }) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <SubmitButton submitButtonContent={submitButtonContent}></SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}