'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { sendEmail } from "@/utils/mail"
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function Contact() {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        if (formData.name.trim() === '') {
            toast({ title: "Error", description: "Name is required", variant: "destructive" })
            return false
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            toast({ title: "Error", description: "Invalid email address", variant: "destructive" })
            return false
        }
        if (formData.message.trim().length < 10) {
            toast({ title: "Error", description: "Message must be at least 10 characters long", variant: "destructive" })
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm()) return

        startTransition(async () => {
            const formDataToSend = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value)
            })

            const result = await sendEmail(formDataToSend)
            if (result.success) {
                toast({ title: "Success", description: "Email sent successfully" })
                router.push('/thank')
            } else {
                toast({ title: "Error", description: result.message, variant: "destructive" })
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                    />
                </div>
                <Button type="submit" className="w-32 bg-gray-200 hover:bg-sky-600 hover:text-white flex justify-center mx-auto" disabled={isPending}>
                    {isPending ? (
                        <><div className="text-black flex">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            送信中...
                        </div>
                        </>
                    ) : (
                        '送信する'
                    )}
                </Button>
            </form>
        </div>
    )
}