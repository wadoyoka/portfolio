import Card from '@/components/elements/Card/Card'
import { Badge } from "@/components/ui/badge"
import { getAllContentIds, getAllContents, getContentById } from '@/utils/SSG/ssgUtils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Tag {
    id: string;
    tag: string;
}

interface WorkItem {
    id: string;
    title: string;
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
                            <Card
                                key={work.id}
                                id={work.id}
                                title={work.title}
                                thumbnailUrl={work.thumbnail.url}
                                tags={work.tags}
                            />
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