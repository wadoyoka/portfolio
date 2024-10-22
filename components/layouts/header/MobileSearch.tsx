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
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                    <Search />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md sm:max-w-[425px] top-4 translate-y-0">
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