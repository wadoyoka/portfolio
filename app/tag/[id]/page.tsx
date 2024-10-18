import Card from '@/components/elements/Card/Card'
import { Badge } from "@/components/ui/badge"
import { getAllContentIds, getAllContents, getContentById } from '@/utils/SSG/ssgUtils'
import { Metadata } from 'next'
import Link from 'next/link'
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

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { works, blogPosts } = await getContentByTag(resolvedParams.id);
    const tag = await getTagById(resolvedParams.id);

    if (!tag) {
        notFound();
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center">
                    Content tagged with:
                    <Badge variant="outline" className="ml-2 text-xl">
                        {tag.tag}
                    </Badge>
                </h1>

                {works.length === 0 && blogPosts.length === 0 ? (
                    <p className="text-xl text-gray-600">No content found with this tag.</p>
                ) : (
                    <>
                        {works.length > 0 && (
                            <>
                                <h2 className="text-2xl font-bold mt-8 mb-4">Works</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {works.map((work) => (
                                        <Card
                                            key={work.id}
                                            id={work.id}
                                            title={work.title}
                                            thumbnailUrl={`/ogp/work/${work.id}.webp`}
                                            tags={work.tags}
                                            linkPrefix="/work/"
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {blogPosts.length > 0 && (
                            <>
                                <h2 className="text-2xl font-bold mt-8 mb-4">Blog Posts</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogPosts.map((post) => (
                                        <Card
                                            key={post.id}
                                            id={post.id}
                                            title={post.title}
                                            thumbnailUrl={`/ogp/blog/${post.id}.webp`}
                                            tags={post.tags}
                                            linkPrefix="/blog/"
                                            publishedAt={post.publishedAt}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                <Link href="/" className="mt-8 inline-block text-blue-600 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        </>
    )
}