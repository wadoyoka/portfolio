import TagBadge from '@/components/elements/TagBadge/TagBadge';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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
}

const Card: React.FC<CardProps> = ({ id, title, thumbnailUrl, tags, linkPrefix = '/work/' }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <Link href={`${linkPrefix}${id}`} className="block">
                <div className="relative w-full h-48">
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <div className="px-4">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
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
    )
}

export default Card