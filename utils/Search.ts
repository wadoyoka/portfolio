'use server'

import { client } from '@/libs/client'
import { headers } from 'next/headers'
import { checkRateLimitAction } from './ratelimit'

export type SearchResult = {
    id: string
    title: string
    summary: string
    category: string[]
    publishedAt: string;
    tags: { id: string; tag: string }[]
    thumbnail: {
        url: string
        height: number
        width: number
    }
}

export async function performSearch(query: string): Promise<{ success: boolean; message: string; remainingAttempts: number; results: SearchResult[] }> {
    const mockRequest = {
        headers: headers(),
        ip: (await headers()).get('x-forwarded-for') || 'unknown',
    } as any

    const { allowed, message, remainingAttempts } = await checkRateLimitAction(mockRequest, 'search')

    if (!allowed) {
        return { success: false, message, remainingAttempts, results: [] }
    }
    console.log(query);
    try {
        const searchResults = await client.getAllContents({
            endpoint: 'atsushi-portfolio',
            queries: { q: query },
        })

        return {
            success: true,
            message: `Searched for: ${query}`,
            remainingAttempts,
            results: searchResults,
        }
    } catch (error) {
        console.error('Search error:', error)
        return {
            success: false,
            message: 'An error occurred while searching',
            remainingAttempts,
            results: [],
        }
    }
}