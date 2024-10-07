import TagBadge from "@/components/elements/TagBadge/TagBadge"
import About from "@/components/layouts/About/About"
import styles from "@/components/layouts/Article/Article.module.scss"
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

async function getWork(id: string): Promise<WorkItem | null> {
    return getContentById<WorkItem>(process.env.SERVICE_DOMAIN as string, id);
}

export async function generateStaticParams() {
    const ids = await getAllContentIds(process.env.SERVICE_DOMAIN as string, 'works');
    return ids.map((id) => ({ id }));
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy/MM/dd') : 'Invalid Date';
}

export default async function Page({ params }: { params: { id: string } }) {
    const work = await getWork(params.id);

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
                                <TagBadge key={tag.id} tag={tag} />
                            ))}
                        </div>
                        <p className="text-lg mb-4">
                            制作期間: {startDate} ~ {endDate}
                        </p>
                        <p className="text-xl mb-8">{work.summary}</p>
                        <MokuziLiist toc={toc} />
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