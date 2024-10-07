import Blog from '@/components/layouts/Blog/Blog';
import { getAllContents } from '@/utils/SSG/ssgUtils';

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
        <div className="min-h-screen flex flex-col">
            <main>
                <Blog blogPosts={blogPosts} />
            </main>
        </div>
    )
}