import TagBadge from "@/components/elements/TagBadge/TagBadge"
import About from "@/components/layouts/About/About"
import styles from "@/components/layouts/Article/Article.module.scss"
import { TableOfContents } from '@/components/layouts/TableOfContents/TableOfContents'
import { renderToc } from '@/libs/render-toc'
import createOgp from '@/utils/ogpUtils'
import { getAllContentIds, getContentById } from '@/utils/SSG/ssgUtils'
import { format, isValid, parseISO } from 'date-fns'
import parse from 'html-react-parser'
import { Metadata } from "next"
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Tag {
    id: string;
    tag: string;
}

interface WorkItem {
    id: string;
    title: string;
    createStartDate?: string;
    createEndDate?: string;
    summary: string;
    body: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    isThumbnailTitle: boolean;
    thunmbnailTitle: string;
    tags: Tag[];
}

const SERVICE_DOMAIN = process.env.SERVICE_DOMAIN as string;

async function getWork(id: string): Promise<WorkItem> {
    try {
        const post = await getContentById<WorkItem>(SERVICE_DOMAIN, id);
        if (!post) {
            throw new Error(`Work post with id ${id} not found`);
        }
        if (post.isThumbnailTitle) {
            await createOgp({
                dynamic: `${id}`,
                imageUrl: `${post.thumbnail.url}`,
                exportPlace: "work",
                text: `${post.thunmbnailTitle}`,
                compressionOptions: { quality: 85, lossless: false, effort: 6 }
            });
        } else {
            await createOgp({
                dynamic: `${id}`,
                imageUrl: `${post.thumbnail.url}`,
                exportPlace: "work",
                text: "",
                compressionOptions: { quality: 85, lossless: false, effort: 6 }
            });
        }
        return post;
    } catch (error) {
        console.error('Error fetching work post:', error);
        notFound();
    }
}

async function generateStaticParams() {
    const ids = await getAllContentIds(process.env.SERVICE_DOMAIN as string, 'works');
    return ids.map((id) => ({ id }));
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy/MM/dd') : 'Invalid Date';
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const work = await getWork(resolvedParams.id);

    if (!work) {
        notFound();
    }

    const startDate = formatDate(work.createStartDate);
    const endDate = formatDate(work.createEndDate);

    const toc = renderToc(work.body);

    return (
        <>
            <main>
                <div className="container mx-auto px-4 py-8 max-w-7xl mb-32">
                    <article>
                        <h1 className="text-4xl font-bold mb-4">{work.title}</h1>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {work.tags.map((tag) => (
                                <TagBadge key={tag.id} tag={tag} />
                            ))}
                        </div>
                        <div className="mb-8">
                            <Image
                                src={`/ogp/work/${work.id}.webp`}
                                alt={work.title}
                                width={work.thumbnail.width}
                                height={work.thumbnail.height}
                                className="w-full h-auto rounded-lg"
                                priority
                            />
                        </div>
                        <h2 className="text-3xl font-semibold mb-4">{work.title}</h2>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {work.tags.map((tag) => (
                                <TagBadge key={tag.id} tag={tag} />
                            ))}
                        </div>
                        <p className="text-lg mb-4">
                            制作期間: {startDate} ~ {endDate}
                        </p>
                        <p className="text-xl mb-8">{work.summary}</p>
                        <TableOfContents toc={toc} />
                        <div className={`${styles.post} prose max-w-none`}>
                            {parse(work.body)}
                        </div>
                    </article>
                </div>
                <About />
            </main>
        </>
    );
}


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const post = await getWork(params.id);

    return {
        title: post.title,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            images: [{ url: post.thumbnail.url }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [post.thumbnail.url],
        },
    };
}

export { generateStaticParams }

