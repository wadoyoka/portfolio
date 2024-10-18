import { client } from '@/libs/client';

interface ContentItem {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export async function getAllContentIds(endpoint: string, category: string): Promise<string[]> {
    try {
        if (category === '') {
            const data = await client.getAllContents({
                customRequestInit: {
                    next: {
                        tags: [endpoint],
                    },
                },
                endpoint: endpoint,
                queries: {
                    fields: 'id'
                }
            });
            return data.map((content: ContentItem) => content.id);
        } else {
            const data = await client.getAllContents({
                customRequestInit: {
                    next: {
                        tags: [endpoint],
                    },
                },
                endpoint: endpoint,
                queries: {
                    fields: 'id',
                    filters: `category[contains]${category}`
                }
            });
            return data.map((content: ContentItem) => content.id);
        }
    } catch (error) {
        console.error(`Failed to fetch ${endpoint} IDs:`, error);
        return [];
    }
}

export async function getContentById<T>(endpoint: string, id: string): Promise<T | null> {
    try {
        const data = await client.get({
            customRequestInit: {
                next: {
                    tags: [endpoint],
                },
            },
            endpoint: endpoint,
            contentId: id,
        });
        return data as T;
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        return null;
    }
}

export async function getAllContents<T>(endpoint: string, queries?: object): Promise<T[]> {
    try {
        const data = await client.getAllContents({
            customRequestInit: {
                next: {
                    tags: [endpoint],
                },
            },
            endpoint: endpoint,
            queries: queries,
        });
        return data as T[];
    } catch (error) {
        console.error(`Failed to fetch all ${endpoint}:`, error);
        return [];
    }
}