import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function About() {
    return (
        <section className="py-12 bg-blue-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-8 text-center">About</h2>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 relative">
                        <Image
                            src="/logo.png"
                            alt="Enomoto Atsushi"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg mb-4">
                            こんにちは、Atsushiです。当サイトでは、私の作った作品などを掲載しております。是非見ていってください。
                        </p>
                        <div className="flex gap-4">
                            <Button variant="default">X</Button>
                            <Button variant="outline">Git</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}