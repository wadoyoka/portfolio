'use server'

import { headers } from 'next/headers'
import { checkRateLimitAction } from './ratelimit'

export async function performSearch(prevState: any, formData: FormData) {
    const searchTerm = formData.get('searchTerm') as string

    // Create a mock NextRequest object
    const mockRequest = {
        headers: headers(),
        ip: headers().get('x-forwarded-for') || 'unknown',
    } as any // Type assertion to avoid TypeScript errors

    const { allowed, message, remainingAttempts } = await checkRateLimitAction(mockRequest, 'search')

    if (!allowed) {
        return { success: false, message, remainingAttempts }
    }

    // Perform your search logic here
    console.log('Searching for:', searchTerm)

    // For demonstration purposes, we're just returning the search term
    // In a real application, you would perform the actual search here
    return {
        success: true,
        message: `Searched for: ${searchTerm}`,
        remainingAttempts,
        results: [`Result 1 for ${searchTerm}`, `Result 2 for ${searchTerm}`, `Result 3 for ${searchTerm}`]
    }
}