import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // ここでデータを取得して、そのデータを使うことも可能
    // const response = await fetcher('https://example.com/blogs')
    // const fields = response.contents.map((content) => {
    //   return {
    //     loc: `https://example.com/${content.category.name}/${content.id}`,
    //     lastmod: content.updatedAt
    //   }
    // })
    const baseURL = process.env.NEXT_PUBLIC_SITE_URL as string;
    const fields = []
    fields.push(
        {
            loc: `${baseURL}`,
            lastmod: new Date().toISOString(),
        },
        {
            loc: `${baseURL}/about`,
            lastmod: new Date().toISOString(),
        },
        {
            loc: `${baseURL}/blog`,
            lastmod: new Date().toISOString(),
        },
        {
            loc: `${baseURL}/contact`,
            lastmod: new Date().toISOString(),
        },
        {
            loc: `${baseURL}/login`,
            lastmod: new Date().toISOString(),
        },
        {
            loc: `${baseURL}/search`,
            lastmod: new Date().toISOString(),
        },
        {
            loc: `${baseURL}/thank`,
            lastmod: new Date().toISOString(),
        },
    )


    return getServerSideSitemapLegacy(ctx, fields)
}


export default function Sitemap() { }