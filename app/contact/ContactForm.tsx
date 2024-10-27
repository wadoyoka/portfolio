'use client'

import SubmitButton from "@/components/elements/SubmitButton/SubmitButton"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { sendEmail } from "@/utils/mail"
import { parseCookies } from "nookies"
import { useState, useTransition } from 'react'

export default function ContactForm() {
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const submitButtonContent = {
        preText: "送信",
        postText: "送信中",
        ispending: isPending
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        startTransition(async () => {
            const formDataToSend = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value)
            })

            const cookies = parseCookies()
            const enhancedUniqueId = cookies.enhancedUniqueId

            const result = await sendEmail(formDataToSend, enhancedUniqueId);
            if (result.success) {
                toast({ title: "送信完了", description: "メールは正しく送信されました！" })
            } else {
                toast({ title: "送信エラー", description: result.message })
            }
        })
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh] max-w-7xl">
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 bg-white text-black">
                        Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 bg-white text-black">
                        MAIL ADRESS
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-white text-black"
                    />
                </div>
                <SubmitButton submitButtonContent={submitButtonContent} />
            </form>
        </div>
    )
}