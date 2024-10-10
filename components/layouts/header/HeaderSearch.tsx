'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { performSearch } from '@/utils/Search'
import { Search } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useFormState } from 'react-dom'

export default function HeaderSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const initialState = { success: true, message: '', remainingAttempts: 0, results: [] }
    const [state, formAction] = useFormState(performSearch, initialState)

    const handleSearch = (formData: FormData) => {
        startTransition(() => {
            formAction(formData)
        })
    }

    if (state.success === false) {
        toast({
            title: "Error",
            description: state.message,
            variant: "destructive",
        })
    } else if (state.success === true && state.message) {
        toast({
            title: "Search performed",
            description: `${state.message}. Remaining attempts: ${state.remainingAttempts}`,
        })
    }

    return (
        <form action={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    type="search"
                    name="searchTerm"
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
                disabled={isPending}
            >
                {isPending ? 'Searching...' : '検索'}
            </Button>
            {state.results && state.results.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
                    <ul className="list-disc pl-5">
                        {state.results.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    )
}