'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendEmail } from "@/lib/mail"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Contact() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const result = await sendEmail(formData)
        if (result.success) {
            router.push('/thank')
        } else {
            setError(result.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh]">
            <h1 className="text-4xl font-bold mb-6">Contact</h1>
            <p className="mb-6">
                ご覧いただきありがとうございます！質問やフィードバック、仕事の依頼など、お気軽にご連絡ください。
                新しいことにチャレンジするのが大好きなので、コラボレーションや興味に関するご相談も大歓迎です！
            </p>
            <p className="mb-6">
                下記のフォームからメッセージを送っていただければ、できるだけ早くご返信いたします。
                SNSでもつながっていただけると嬉しいです！
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form action={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        MAIL ADRESS
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        MESSAGE
                    </label>
                    <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                    />
                </div>
                <Button type="submit" className="w-full">
                    送信する
                </Button>
            </form>
        </div>
    )
}