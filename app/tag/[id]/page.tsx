import Card from '@/components/elements/Card/Card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllContentIds, getAllContents, getContentById } from '@/utils/SSG/ssgUtils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'


interface Tag {
    id: string;
    tag: string;
}

interface ContentItem {
    id: string;
    title: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    tags: Tag[];
    createDate?: string;
    publishedAt?: string;
    summary?: string;
}

async function getContentByTag(tagId: string): Promise<{ works: ContentItem[], blogPosts: ContentItem[] }> {
    const works = await getAllContents<ContentItem>(process.env.SERVICE_DOMAIN as string, { filters: `tags[contains]${tagId},category[contains]works` });
    const blogPosts = await getAllContents<ContentItem>(process.env.SERVICE_DOMAIN as string, { filters: `tags[contains]${tagId},category[contains]blog` });
    return { works, blogPosts };
}

async function getTagById(tagId: string): Promise<Tag | null> {
    return getContentById<Tag>('tag', tagId);
}

export async function generateStaticParams() {
    const tagIds = await getAllContentIds('tag', '');
    return tagIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const tag = await getTagById(resolvedParams.id);

    if (!tag) {
        notFound();
    }


    return {
        title: tag.tag,
        description: `Enomoto Atsushiのタグ「${tag.tag}」に関する制作物、ブログを集めたページです。`,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
        openGraph: {
            title: tag.tag,
            description: `Enomoto Atsushiのタグ「${tag.tag}」に関する制作物、ブログを集めたページです。`,
            url: `/tag/${tag.id}`,
            siteName: 'Atsushi Portfolio',
            images: [
                {
                    url: '/ogp/og-image.webp',
                    width: 1200,
                    height: 630,
                },
            ],
            locale: 'ja_JP',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: tag.tag,
            description: `Enomoto Atsushiのタグ「${tag.tag}」に関する制作物、ブログを集めたページです。`,
            images: [{
                url: '/ogp/og-image.webp',
                width: 1200,
                height: 630,
            },],
            creator: '@wadoyoka',
        },
    };
}

function ResultGrid({ items, linkPrefix }: { items: ContentItem[], linkPrefix: string }) {
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


export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { works, blogPosts } = await getContentByTag(resolvedParams.id);
    const tag = await getTagById(resolvedParams.id);

    if (!tag) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                Tag:
                <Badge variant="outline" className="ml-2 text-xl bg-white text-black">
                    {tag.tag}
                </Badge>
            </h1>
            <Tabs defaultValue="work" className="w-full">
                <TabsList className='bg-slate-200'>
                    <TabsTrigger value="work" className='data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold'>work {works.length}</TabsTrigger>
                    <TabsTrigger value="blog" className='data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-bold'>Blog {blogPosts.length}</TabsTrigger>
                </TabsList>
                <TabsContent value="work">
                    <ResultGrid items={works} linkPrefix="/work/" />
                </TabsContent>
                <TabsContent value="blog">
                    <ResultGrid items={blogPosts} linkPrefix="/blog/" />
                </TabsContent>
            </Tabs>

        </div>
    )
}