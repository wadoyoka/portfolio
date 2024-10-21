import TagBadge from "@/components/elements/TagBadge/TagBadge"
import About from "@/components/layouts/About/About"
import styles from "@/components/layouts/Article/Article.module.scss"
import { TableOfContents } from '@/components/layouts/TableOfContents/TableOfContents'
import { renderToc } from '@/libs/render-toc'
import { getAllContentIds, getContentById } from '@/utils/SSG/ssgUtils'
import { formatDate } from '@/utils/dateUtils'
import createOgp from "@/utils/ogpUtils"
import parse from 'html-react-parser'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'


interface Tag {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    tag: string;
}

interface BlogPost {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title: string;
    createStartDate: string;
    createEndDate: string;
    summary: string;
    body: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    isThumbnailTitle: boolean;
    thunmbnailTitle: string;
    category: string[];
    tags: Tag[];
}

const SERVICE_DOMAIN = process.env.SERVICE_DOMAIN as string;
if (!SERVICE_DOMAIN) {
    throw new Error('SERVICE_DOMAIN is not defined in environment variables');
}

async function getBlogPost(id: string): Promise<BlogPost> {
    try {
        const post = await getContentById<BlogPost>(SERVICE_DOMAIN, id);
        if (!post) {
            throw new Error(`Blog post with id ${id} not found`);
        }
        return post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        notFound();
    }
}

export async function generateStaticParams() {
    try {
        const ids = await getAllContentIds(SERVICE_DOMAIN, 'blog');
        return ids.map((id) => ({ id }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getBlogPost(resolvedParams.id);

    return {
        title: post.title,
        description: post.summary,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
        openGraph: {
            title: post.title,
            description: post.summary,
            url: `/blog/${resolvedParams.id}`,
            siteName: 'Atsushi Portfolio',
            images: [
                {
                    url: `/ogp/blog/${post.id}.webp`,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: 'ja_JP',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [`/ogp/blog/${post.id}.webp`],
            creator: '@wadoyoka',
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const post = await getBlogPost(resolvedParams.id);

    if (post.isThumbnailTitle) {
        await createOgp({
            dynamic: `${post.id}`,
            imageUrl: `${post.thumbnail.url}`,
            exportPlace: "blog",
            text: `${post.thunmbnailTitle}`,
            compressionOptions: { quality: 85, lossless: false, effort: 6 }
        });
    } else {
        await createOgp({
            dynamic: `${post.id}`,
            imageUrl: `${post.thumbnail.url}`,
            exportPlace: "blog",
            text: "",
            compressionOptions: { quality: 85, lossless: false, effort: 6 }
        });
    }

    const publishedDate = formatDate(post.publishedAt);
    const updatedDate = formatDate(post.updatedAt);

    const toc = renderToc(post.body);

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-7xl mb-32">
                <article itemScope itemType="http://schema.org/BlogPosting">
                    <h1 className="text-4xl font-bold mb-4" itemProp="headline">{post.title}</h1>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <TagBadge key={tag.id} tag={tag} />
                        ))}
                    </div>
                    <div className="mb-8">
                        <Image
                            src={`/ogp/blog/${post.id}.webp`}
                            alt={post.title}
                            width={post.thumbnail.width}
                            height={post.thumbnail.height}
                            className="w-full h-auto rounded-lg"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            itemProp="image"
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">公開日: <time itemProp="datePublished" dateTime={post.publishedAt}>{publishedDate}</time></p>
                        <p className="text-gray-600">更新日: <time itemProp="dateModified" dateTime={post.updatedAt}>{updatedDate}</time></p>
                    </div>
                    <p className="text-xl mb-8" itemProp="description">{post.summary}</p>
                    <nav aria-label="Table of Contents">
                        <TableOfContents toc={toc} />
                    </nav>
                    <div className={`${styles.post} prose max-w-none`} itemProp="articleBody">
                        {parse(post.body)}
                    </div>
                </article>
            </div>
            <About />
        </div>
    );
}