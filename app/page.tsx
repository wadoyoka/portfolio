import Top from '@/components/layouts/Top/top';
import Works from '@/components/layouts/Works/Works';
import { client } from '@/libs/client';

interface WorkItem {
  id: string;
  title: string;
  publishedAt: string;
  summary: string;
  thumbnail: {
    url: string;
    height: number;
    width: number;
  };
  tags: {
    id: string;
    tag: string;
  }[];
}

async function getWorks(): Promise<WorkItem[]> {
  try {
    const data = await client.getAllContents({
      customRequestInit: {
        next: {
          tags: [process.env.SERVICE_DOMAIN as string],
        },
      },
      endpoint: process.env.SERVICE_DOMAIN as string,
      queries: {fields: 'id,publishedAt,title,thumbnail,tags,summary,category' ,filters: 'category[contains]works' },
    });
    return data; // Remove .contents as getAllContents directly returns the array of items
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return [];
  }
}

export default async function Home() {
  const works = await getWorks();

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <Top></Top>
        <Works works={works} />
      </main>
    </div>
  )
}