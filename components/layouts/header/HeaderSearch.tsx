'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HeaderSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="検索..."
                    className="w-40 lg:w-64 pl-8 bg-background text-foreground"
                />
            </div>
            <Button 
                type="submit" 
                variant="secondary" 
                size="sm" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                検索
            </Button>
        </form>
    )
}