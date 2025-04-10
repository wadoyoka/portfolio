import Card from '@/components/elements/Card/Card';

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

interface BlogProps {
    blogPosts: BlogPost[];
}

export default function Blog({ blogPosts }: BlogProps) {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <h2 className="text-4xl font-bold mb-8 text-center">Blog Posts</h2>
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
                            summary={post.summary}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}