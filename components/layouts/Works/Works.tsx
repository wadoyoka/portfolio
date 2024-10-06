import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import Link from 'next/link';

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
                        <Link href={`/work/${work.id}`} key={work.id} className="block">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={work.thumbnail.url}
                                        alt={work.title}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                                    {/* <p className="text-gray-600 text-sm mb-4">{work.summary}</p> */}
                                    <div className="flex flex-wrap gap-2">
                                        {work.tags.map((tag) => (
                                            <Badge key={tag.id} variant="outline">{tag.tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}