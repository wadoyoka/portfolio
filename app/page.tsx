import About from '@/components/layouts/About/About'
import Footer from '@/components/layouts/Footer/Footer'
import Header from '@/components/layouts/Header/Header'
import Top from '@/components/layouts/Top/top'
import Works from '@/components/layouts/Works/Works'
import { client } from '@/libs/client'

interface WorkItem {
  id: string;
  title: string;
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
    const data = await client.getList({
      endpoint: process.env.SERVICE_DOMAIN as string,
      queries: { filters: 'category[contains]works' },
    });
    return data.contents;
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return [];
  }
}

export default async function Home() {
  const works = await getWorks();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Top></Top>
        <Works works={works} />
        <About />
      </main>
      <Footer />
    </div>
  )
}