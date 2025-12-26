import Blog from '@/components/layouts/Blog/Blog';
import { getAllContents } from '@/utils/SSG/ssgUtils';
import { Metadata } from 'next';

interface Tag {
    id: string;
    tag: string;
}

interface BlogPost {
    id: string;
    title: string;
    publishedAt: string;
    summary: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    tags: Tag[];
}

const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Author Name'

//後で確認
export const metadata: Metadata = {
    title: 'Blog',
    description: `${authorName}のブログを掲載したページです。`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
    openGraph: {
        title: 'Blog',
        description: `${authorName}のブログを掲載したページです。`,
        url: '/blog',
        siteName: `${authorName} Portfolio`,
        images: [
            {
                url: '/ogp/og-image.webp',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'ja_JP',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog',
        description: `${authorName}のブログを掲載したページです。`,
        images: [{
            url: '/ogp/og-image.webp',
            width: 1200,
            height: 630,
        },],
        creator: '@wadoyoka',
    },
}

async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const data = await getAllContents<BlogPost>(process.env.SERVICE_DOMAIN as string, { filters: 'category[contains]blog' });
        return data;
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}

export default async function BlogPage() {
    const blogPosts = await getBlogPosts();

    return (
        <div className="min-h-[80vh] flex flex-col bg-gray-50">
            <main>
                <Blog blogPosts={blogPosts} />
            </main>
        </div>
    )
}