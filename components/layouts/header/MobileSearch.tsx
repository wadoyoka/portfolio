'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function MobileSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            const target = searchTerm.trim();
            setSearchTerm('');
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(target)}`)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div>
                    <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
                            <Search />
                    </Button>
                    <Button variant="ghost" aria-label="Menu" className="hidden md:block">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="search"
                                    placeholder="検索..."
                                    className="w-40 lg:w-64 pl-8 bg-background text-foreground"
                                />
                            </div>
                        </div>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md sm:max-w-[425px] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-md:top-4 max-md:translate-y-0">
                <DialogHeader>
                    <DialogTitle>検索</DialogTitle>
                    <DialogDescription>
                        検索したい、制作物、ブログのキーワードを入力してください。
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="検索..."
                            />
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

}