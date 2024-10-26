import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import React from 'react';

interface Tag {
    id: string;
    tag: string;
}

interface TagBadgeProps {
    tag: Tag;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
    return (
        <Link href={`/tag/${tag.id}`}>
            <Badge
                variant="outline"
                className="cursor-pointer transition-all duration-300 text-white bg-slate-200 hover:bg-blue-600 hover:text-white"
            >
                {tag.tag}
            </Badge>
        </Link>
    )
}

export default TagBadge