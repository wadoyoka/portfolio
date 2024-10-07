'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react'

export default function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log({ name, email, message })
        toast({
            title: "メッセージが送信されました",
            description: "ありがとうございます。できるだけ早くご返信いたします。",
        })
        setName('')
        setEmail('')
        setMessage('')
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        MAIL ADRESS
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        MESSAGE
                    </label>
                    <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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