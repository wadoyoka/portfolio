import Card from '@/components/elements/Card/Card';

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
    createDate?: string;
    summary?: string;
}

interface WorksProps {
    works: WorkItem[];
}

export default function Works({ works }: WorksProps) {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {works.map((work) => (
                        <Card
                            key={work.id}
                            id={work.id}
                            title={work.title}
                            thumbnailUrl={`/ogp/work/${work.id}.webp`}
                            tags={work.tags}
                            createDate={work.createDate}
                            summary={work.summary}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}