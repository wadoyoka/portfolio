import Footer from "@/components/layouts/Footer/Footer"
import Header from "@/components/layouts/Header/Header"
import { MokuziLiist } from '@/components/layouts/Mokuzi/Mokuzi'
import { Badge } from "@/components/ui/badge"
import { client } from '@/libs/client'
import { renderToc } from '@/libs/render-toc'
import { format, isValid, parseISO } from 'date-fns'
import parse from 'html-react-parser'
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

function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy/MM/dd') : 'Invalid Date';
}

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const work = await getWork(params.id);

        console.log('Raw start date:', work.createStartDate);
        console.log('Raw end date:', work.createEndDate);

        const startDate = formatDate(work.createStartDate);
        const endDate = formatDate(work.createEndDate);

        const toc = renderToc(work.body);

        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-8 max-w-4xl">
                    <article>
                        <h1 className="text-4xl font-bold mb-4">{work.title}</h1>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {work.tags.map((tag) => (
                                <Badge key={tag.id} variant="outline">
                                    {tag.tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="mb-8">
                            <Image
                                src={work.thumbnail.url}
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
                                <Badge key={tag.id} variant="outline">
                                    {tag.tag}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-lg mb-4">
                            制作期間: {startDate} ~ {endDate}
                        </p>
                        <p className="text-xl mb-8">{work.summary}</p>
                        <MokuziLiist toc={toc} />
                        <div className="prose max-w-none">
                            {parse(work.body)}
                        </div>
                    </article>
                </main>
                <Footer />
            </>
        );
    } catch (error) {
        console.error('Error fetching work:', error);
        notFound();
    }
}