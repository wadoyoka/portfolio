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
}

interface WorksProps {
    works: WorkItem[];
}

export default function Works({ works }: WorksProps) {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-8 text-center">Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>
        </section>
    )
}