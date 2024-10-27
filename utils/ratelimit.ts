'use server'

import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'
import dns from 'dns'
import { NextRequest } from 'next/server'
import { promisify } from 'util'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Sliding window size in seconds
const WINDOW_SIZE = 60
// Time to block an IP if it exceeds the rate limit (in seconds)
const BLOCK_DURATION = 3600 // 1 hour

// Separate limits for email and search
const LIMITS = {
    email: { max: 5, window: 60 * 60 }, // 5 requests per hour
    search: { max: 20, window: 60 }, // 20 requests per minute
    login: { max: 10, window: 60 * 60 }, // 10 requests per hour
}

// Global limit to prevent DDoS
const GLOBAL_MAX_REQUESTS = 100

const reverseDns = promisify(dns.reverse)

async function getClientIP(req: NextRequest): Promise<string> {
    const forwardedFor = req.headers.get('x-forwarded-for')
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }

    const realIP = req.headers.get('x-real-ip')
    if (realIP) {
        return realIP.trim()
    }

    return forwardedFor ?? 'unknown'
}

async function getHostname(ip: string): Promise<string> {
    try {
        const hostnames = await reverseDns(ip)
        return hostnames[0] || 'unknown'
    } catch (error) {
        console.error('Error resolving hostname:', error)
        return 'unknown'
    }
}

function hashIdentifier(identifier: string): string {
    return createHash('sha256').update(identifier + process.env.IDENTIFIER_SALT).digest('hex')
}

async function isIdentifierBlocked(hashedIdentifier: string): Promise<boolean> {
    const blocked = await redis.get(`blocked:${hashedIdentifier}`)
    return !!blocked
}

async function blockIdentifier(hashedIdentifier: string): Promise<void> {
    await redis.set(`blocked:${hashedIdentifier}`, '1', { ex: BLOCK_DURATION })
}


async function checkRateLimit(hashedIdentifier: string, action: 'email' | 'search' | 'login'): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000)
    const actionKey = `ratelimit:${action}:${hashedIdentifier}`
    const globalKey = `ratelimit:global:${hashedIdentifier}`

    const pipeline = redis.pipeline()

    // Action-specific rate limit
    pipeline.zremrangebyscore(actionKey, 0, now - LIMITS[action].window)
    pipeline.zadd(actionKey, { score: now, member: now.toString() })
    pipeline.zcard(actionKey)
    pipeline.expire(actionKey, LIMITS[action].window)

    // Global rate limit
    pipeline.zremrangebyscore(globalKey, 0, now - WINDOW_SIZE)
    pipeline.zadd(globalKey, { score: now, member: now.toString() })
    pipeline.zcard(globalKey)
    pipeline.expire(globalKey, WINDOW_SIZE)

    const results = await pipeline.exec()
    const actionRequestCount = results[2] as number
    const globalRequestCount = results[6] as number

    if (actionRequestCount > LIMITS[action].max || globalRequestCount > GLOBAL_MAX_REQUESTS) {
        await blockIdentifier(hashedIdentifier)
        return false
    }

    return true
}

export async function checkRateLimitAction(req: NextRequest, action: 'email' | 'search' | 'login'): Promise<{ allowed: boolean; message: string; remainingAttempts: number }> {
    const ip = await getClientIP(req)
    const hostname = await getHostname(ip)
    const hasedInfo = hashIdentifier(ip + hostname)

    if (await isIdentifierBlocked(hasedInfo)) {
        return { allowed: false, message: 'Your access has been temporarily blocked due to excessive requests.', remainingAttempts: 0 }
    }

    const allowedInfo = await checkRateLimit(hasedInfo, action)

    if (!allowedInfo) {
        return { allowed: false, message: `${action} rate limit exceeded. Please try again later.`, remainingAttempts: 0 }
    }

    const key = `ratelimit:${action}:${hasedInfo}`
    const requestCount = await redis.zcard(key)
    const remainingAttempts = Math.max(0, LIMITS[action].max - requestCount)

    return { allowed: true, message: 'Action allowed', remainingAttempts }
}