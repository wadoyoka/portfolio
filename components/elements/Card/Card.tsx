import TagBadge from '@/components/elements/TagBadge/TagBadge';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FadeInBottom } from '../FadeInBottom/FadeInBottom';

interface Tag {
    id: string;
    tag: string;
}

interface CardProps {
    id: string;
    title: string;
    thumbnailUrl: string;
    tags: Tag[];
    linkPrefix?: string;
    publishedAt?: string;
    summary?: string;
}

const Card: React.FC<CardProps> = ({ id, title, thumbnailUrl, tags, linkPrefix = '/work/', publishedAt, summary }) => {
    return (
        <div className='transition-transform duration-300 hover:scale-105'>
            <FadeInBottom>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`${linkPrefix}${id}`} className="block">
                        <div className="relative w-full h-48">
                            <Image
                                src={thumbnailUrl}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            {publishedAt && (
                                <p className="text-sm text-gray-500 mb-2">
                                    公開日: {new Date(publishedAt).toLocaleDateString()}
                                </p>
                            )}
                            {summary && <p className="text-gray-600 text-sm mb-2">{summary}</p>}
                        </div>
                    </Link>
                    <div className="px-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <TagBadge key={tag.id} tag={tag} />
                            ))}
                        </div>
                    </div>
                </div>
            </FadeInBottom>
        </div>
    )
}

export default Card