'use server'

import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'
import { NextRequest } from 'next/server'

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
}

// Global limit to prevent DDoS
const GLOBAL_MAX_REQUESTS = 100

async function getClientIP(req: NextRequest): Promise<string> {
    const forwardedFor = req.headers.get('x-forwarded-for')
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }

    const realIP = req.headers.get('x-real-ip')
    if (realIP) {
        return realIP.trim()
    }

    return req.ip ?? 'unknown'
}

function hashIP(ip: string): string {
    return createHash('sha256').update(ip + process.env.IP_SALT).digest('hex')
}

async function isIPBlocked(hashedIP: string): Promise<boolean> {
    const blocked = await redis.get(`blocked:${hashedIP}`)
    return !!blocked
}

async function blockIP(hashedIP: string): Promise<void> {
    await redis.set(`blocked:${hashedIP}`, '1', { ex: BLOCK_DURATION })
}

async function checkRateLimit(hashedIP: string, action: 'email' | 'search'): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000)
    const actionKey = `ratelimit:${action}:${hashedIP}`
    const globalKey = `ratelimit:global:${hashedIP}`

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
        await blockIP(hashedIP)
        return false
    }

    return true
}

export async function checkRateLimitAction(req: NextRequest, action: 'email' | 'search'): Promise<{ allowed: boolean; message: string; remainingAttempts: number }> {
    const ip = await getClientIP(req)
    const hashedIP = hashIP(ip)

    if (await isIPBlocked(hashedIP)) {
        return { allowed: false, message: 'Your IP has been temporarily blocked due to excessive requests.', remainingAttempts: 0 }
    }

    const allowed = await checkRateLimit(hashedIP, action)
    const key = `ratelimit:${action}:${hashedIP}`
    const requestCount = await redis.zcard(key)
    const remainingAttempts = Math.max(0, LIMITS[action].max - requestCount)

    if (allowed) {
        return { allowed: true, message: 'Action allowed', remainingAttempts }
    } else {
        return { allowed: false, message: `${action} rate limit exceeded. Please try again later.`, remainingAttempts }
    }
}