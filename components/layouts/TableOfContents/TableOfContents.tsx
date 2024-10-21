import Link from 'next/link';
import React from 'react';
import styles from './TableOfContents.module.scss';

interface TocItem {
    id: string;
    text: string;
    name: string;
}

interface TableOfContentsProps {
    toc: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
    const result: JSX.Element[] = [];
    let h2List: JSX.Element[] = [];

    toc.forEach((data, index) => {
        if (data.name === 'h1') {
            if (h2List.length > 0) {
                result.push(
                    <ol key={`sublist-${index}`} className={styles.sublist}>
                        {h2List}
                    </ol>
                );
                h2List = [];
            }

            result.push(
                <li key={data.id}>
                    <Link href={`#${data.id}`} className='text-blue-600 hover:text-orange-500 decoration-2 hover:underline focus:outline-none focus:underline visited:text-purple-600'>
                        {data.text}
                    </Link>
                </li>
            );
        } else if (data.name === 'h2') {
            h2List.push(
                <li key={data.id}>
                    <Link href={`#${data.id}`} className='text-blue-600 hover:text-orange-500 decoration-2 hover:underline focus:outline-none focus:underline visited:text-purple-600'>
                        {data.text}
                    </Link>
                </li>
            );
        }

        if (index === toc.length - 1 && h2List.length > 0) {
            result.push(
                <ol key={`sublist-last`} className={styles.sublist}>
                    {h2List}
                </ol>
            );
        }
    });

    return (
        <div className={styles.toc_002}>
            <div>目次</div>
            <ol>{result}</ol>
        </div>
    );
};