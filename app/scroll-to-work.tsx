'use client'

import { Button } from "@/components/ui/button"
import { CircleArrowDown } from "lucide-react"
import { useRef } from 'react'

export default function ToptoWork() {
    const section1Ref = useRef<HTMLDivElement>(null)

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            <div className="flex mb-48 md:hidden">
                <div className="mx-auto">
                    <Button variant="ghost" size="icon" onClick={() => scrollToSection(section1Ref)}>
                        <div className="animate-heartbeat">
                            <CircleArrowDown size={80} />
                        </div>
                    </Button>
                </div>
            </div>
            <section className="pt-12 bg-gray-50" ref={section1Ref}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-4xl font-bold text-center">Works</h2>
                </div>
            </section>
        </>
    )
}