import TagBadge from "@/components/elements/TagBadge/TagBadge"
import { MokuziLiist } from '@/components/layouts/Mokuzi/Mokuzi'
import { renderToc } from '@/libs/render-toc'
import { getAllContentIds, getContentById } from '@/utils/SSG/ssgUtils'
import { format, isValid, parseISO } from 'date-fns'
import parse from 'html-react-parser'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Tag {
    id: string;
    tag: string;
}

interface BlogPost {
    id: string;
    title: string;
    publishedAt: string;
    updatedAt?: string;
    summary: string;
    body: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    tags: Tag[];
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
    return getContentById<BlogPost>(process.env.SERVICE_DOMAIN as string , id);
}

export async function generateStaticParams() {
    const ids = await getAllContentIds(process.env.SERVICE_DOMAIN as string, 'blog');
    return ids.map((id) => ({ id }));
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy/MM/dd') : 'Invalid Date';
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
    const post = await getBlogPost(params.id);

    if (!post) {
        notFound();
    }

    const publishedDate = formatDate(post.publishedAt);
    const updatedDate = formatDate(post.updatedAt);

    const toc = renderToc(post.body);

    return (
        <>
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <article>
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} />
                        ))}
                    </div>
                    <div className="mb-8">
                        <Image
                            src={post.thumbnail.url}
                            alt={post.title}
                            width={post.thumbnail.width}
                            height={post.thumbnail.height}
                            className="w-full h-auto rounded-lg"
                            priority
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">Published: {publishedDate}</p>
                        {post.updatedAt && <p className="text-gray-600">Last updated: {updatedDate}</p>}
                    </div>
                    <p className="text-xl mb-8">{post.summary}</p>
                    <MokuziLiist toc={toc} />
                    <div className="prose max-w-none">
                        {parse(post.body)}
                    </div>
                </article>
            </main>
        </>
    );
}