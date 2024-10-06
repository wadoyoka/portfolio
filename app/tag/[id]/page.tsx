import TagBadge from '@/components/elements/TagBadge/TagBadge'
import { Badge } from "@/components/ui/badge"
import { getAllContentIds, getAllContents, getContentById } from '@/utils/SSG/ssgUtils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Tag {
    id: string;
    tag: string;
}

interface WorkItem {
    id: string;
    title: string;
    summary: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    tags: Tag[];
}

async function getWorksByTag(tagId: string): Promise<WorkItem[]> {
    return getAllContents<WorkItem>(process.env.SERVICE_DOMAIN as string, { filters: `tags[contains]${tagId}` });
}

async function getTagById(tagId: string): Promise<Tag | null> {
    return getContentById<Tag>('tag', tagId);
}

export async function generateStaticParams() {
    const tagIds = await getAllContentIds('tag');
    return tagIds.map((id) => ({ id }));
}

export default async function TagPage({ params }: { params: { id: string } }) {
    const works = await getWorksByTag(params.id);
    const tag = await getTagById(params.id);

    if (!tag) {
        notFound();
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center">
                    Works tagged with:
                    <Badge variant="outline" className="ml-2 text-xl">
                        {tag.tag}
                    </Badge>
                </h1>

                {works.length === 0 ? (
                    <p className="text-xl text-gray-600">No works found with this tag.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {works.map((work) => (
                            <div key={work.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                                <Link href={`/work/${work.id}`}>
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={work.thumbnail.url}
                                            alt={work.title}
                                            fill
                                            style={{ objectFit: 'cover' }} />
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{work.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4">{work.summary}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {work.tags.map((tag) => (
                                            <TagBadge key={tag.id} tag={tag} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Link href="/" className="mt-8 inline-block text-blue-600 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        </>
    )
}