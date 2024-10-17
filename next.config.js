/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.microcms-assets.io'
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            },
        ]
    },
    experimental: {
        serverComponentsExternalPackages: ['canvas', 'sharp'],
    },
}

module.exports = nextConfig