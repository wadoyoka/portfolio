import Card from '@/components/elements/Card/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { performSearch, SearchResult } from '@/utils/Search';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

async function SearchResults({ query }: { query: string }) {
    const enhancedUniqueId = cookies().get('enhancedUniqueId')?.value;
    
    const results = await performSearch(query, (enhancedUniqueId as string));

    if (!results.success) {
        return <div className="text-red-500">{results.message}</div>
    }

    const workResults = results.results.filter(item => item.category.includes('works'))
    const blogResults = results.results.filter(item => item.category.includes('blog'))

    return (
        <Tabs defaultValue="work" className="w-full">
            <TabsList className='bg-slate-200'>
                <TabsTrigger value="work" className='data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold'>work {workResults.length}</TabsTrigger>
                <TabsTrigger value="blog" className='data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold'>Blog {blogResults.length}</TabsTrigger>
            </TabsList>
            <TabsContent value="work">
                <ResultGrid items={workResults} linkPrefix="/work/" />
            </TabsContent>
            <TabsContent value="blog">
                <ResultGrid items={blogResults} linkPrefix="/blog/" />
            </TabsContent>
        </Tabs>
    )
}

function ResultGrid({ items, linkPrefix }: { items: SearchResult[], linkPrefix: string }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
                <Card
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    thumbnailUrl={`/ogp${linkPrefix}${item.id}.webp`}
                    tags={item.tags}
                    linkPrefix={linkPrefix}
                    publishedAt={item.publishedAt}
                    createDate={item.createDate}
                    summary={item.summary}
                />
            ))}
        </div>
    )
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>
}) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || '';

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-4xl font-bold mb-6">検索結果: {query}</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResults query={query} />
            </Suspense>
        </div>
    )
}