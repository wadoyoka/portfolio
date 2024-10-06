import { client } from '@/libs/client';

interface ContentItem {
    id: string;
    [key: string]: any;
}

export async function getAllContentIds(endpoint: string): Promise<string[]> {
    try {
        const data = await client.getAllContents({
            endpoint: endpoint,
            queries: { fields: 'id' }
        });
        return data.map((content: ContentItem) => content.id);
    } catch (error) {
        console.error(`Failed to fetch ${endpoint} IDs:`, error);
        return [];
    }
}

export async function getContentById<T>(endpoint: string, id: string): Promise<T | null> {
    try {
        const data = await client.get({
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
            endpoint: endpoint,
            queries: queries,
        });
        return data as T[];
    } catch (error) {
        console.error(`Failed to fetch all ${endpoint}:`, error);
        return [];
    }
}