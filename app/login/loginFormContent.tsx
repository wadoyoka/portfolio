'use client'

import SubmitButton from "@/components/elements/SubmitButton/SubmitButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
// Cookieの取得と設定
import { CryptoUtils } from "@/utils/crypto-utils"
import { parseCookies, setCookie } from 'nookies'


function generateRandomString(length: number): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

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



    useEffect(() => {
        const cookies = parseCookies()

        if (!cookies.enhancedUniqueId) {
            const setEnhancedUniqueCookie = async () => {
                try {
                    // IPアドレスを取得（例としてipify.orgのAPIを使用）
                    const ipResponse = await fetch('https://api.ipify.org?format=json')
                    const ipData = await ipResponse.json()
                    const ip = ipData.ip

                    // 現在の時刻を取得
                    const timestamp = new Date().getTime()

                    // ランダムな文字列を生成（例: 16バイト）
                    const randomString = generateRandomString(16)

                    // IPアドレス、時刻、ランダムな文字列を組み合わせてハッシュ化
                    const uniqueString = `${ip}-${timestamp}-${randomString}`
                    const hash = CryptoUtils.sha256Hash(uniqueString);

                    // ハッシュ化された値をCookieとして設定
                    setCookie(null, 'enhancedUniqueId', hash, {
                        maxAge: 30 * 24 * 60 * 60, // 30日間
                        path: '/',
                        secure: true, // HTTPS接続でのみCookieを送信
                        sameSite: 'strict' // CSRF攻撃を防ぐ
                    })

                    console.log('Enhanced unique cookie set')
                } catch (error) {
                    console.error('Error setting enhanced unique cookie:', error)
                }
            }

            setEnhancedUniqueCookie()
        } else {
            console.log('Enhanced unique cookie already exists')
        }
    }, [])



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
                const cookies = parseCookies()
                const enhancedUniqueId = cookies.enhancedUniqueId
                const result = await signIn('credentials', {
                    redirect: false,
                    username,
                    password,
                    enhancedUniqueId
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