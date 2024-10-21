/** @type {import('next-sitemap').IConfig} */  // このコードがあるとコード補完が可能になる
module.exports = {
    siteUrl: `${process.env.NEXT_PUBLIC_SITE_URL}`, // カスタムドメイン
    generateRobotsTxt: true,
    sitemapSize: 7000, // 大きなサイトマップになる場合のファイル分割行う閾値
    exclude: ['/server-sitemap.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [
            `${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`,
        ],
    }
};