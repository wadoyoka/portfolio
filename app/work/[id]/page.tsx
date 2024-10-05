import { Badge } from "@/components/ui/badge"
import { client } from '@/libs/client'
import { format } from 'date-fns'
import parse from 'html-react-parser'
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

interface WorkItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title: string;
    createStartDate: string;
    summary: string;
    body: string;
    thumbnail: {
        url: string;
        height: number;
        width: number;
    };
    isThumbnailTitle: boolean;
    category: string[];
    tags: Tag[];
}

async function getWork(id: string): Promise<WorkItem> {
    try {
        const data = await client.get({
            endpoint: process.env.SERVICE_DOMAIN as string,
            contentId: id,
        });
        return data;
    } catch (error) {
        console.error('Failed to fetch work:', error);
        throw new Error('Failed to fetch work');
    }
}

async function getAllWorkIds(): Promise<string[]> {
    try {
        const data = await client.getAllContents({
            endpoint: process.env.SERVICE_DOMAIN as string,
        });
        return data.map((content: { id: string }) => content.id);
    } catch (error) {
        console.error('Failed to fetch work IDs:', error);
        return [];
    }
}

export async function generateStaticParams() {
    const ids = await getAllWorkIds();
    return ids.map((id) => ({ id }));
}

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const work = await getWork(params.id);

        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">{work.title}</h1>
                <div className="mb-6">
                    <Image
                        src={work.thumbnail.url}
                        alt={work.title}
                        width={work.thumbnail.width}
                        height={work.thumbnail.height}
                        className="rounded-lg"
                    />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {work.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">{tag.tag}</Badge>
                    ))}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    <p>Created: {format(new Date(work.createdAt), 'PPP')}</p>
                    <p>Last Updated: {format(new Date(work.updatedAt), 'PPP')}</p>
                    <p>Project Start Date: {format(new Date(work.createStartDate), 'PPP')}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-2">Categories</h2>
                    <div className="flex flex-wrap gap-2">
                        {work.category.map((cat, index) => (
                            <Badge key={index} variant="outline">{cat}</Badge>
                        ))}
                    </div>
                </div>
                <p className="text-xl mb-4">{work.summary}</p>
                <div className="prose max-w-none">
                    {parse(work.body)}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching work:', error);
        notFound();
    }
}