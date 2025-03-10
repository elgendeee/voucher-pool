import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
class RateLimiter {
    private requests: Map<string, { count: number; resetTime: number }>;
    private readonly limit: number;
    private readonly windowMs: number;

    constructor(limit = 100, windowMs = 60 * 1000) {
        this.requests = new Map();
        this.limit = limit;
        this.windowMs = windowMs;
    }

    check(ip: string): boolean {
        const now = Date.now();
        const record = this.requests.get(ip);

        if (!record) {
            this.requests.set(ip, {
                count: 1,
                resetTime: now + this.windowMs
            });
            return true;
        }

        if (now >= record.resetTime) {
            // Reset window
            record.count = 1;
            record.resetTime = now + this.windowMs;
            this.requests.set(ip, record);
            return true;
        }

        if (record.count >= this.limit) {
            return false;
        }

        // Increment count
        record.count += 1;
        this.requests.set(ip, record);
        return true;
    }

    getRemainingRequests(ip: string): number {
        const record = this.requests.get(ip);
        if (!record) {
            return this.limit;
        }

        if (Date.now() >= record.resetTime) {
            return this.limit;
        }

        return Math.max(0, this.limit - record.count);
    }

    getResetTime(ip: string): number {
        const record = this.requests.get(ip);
        if (!record) {
            return Date.now() + this.windowMs;
        }

        return record.resetTime;
    }
}

// Create a rate limiter instance
// Limit: 100 requests per minute
const limiter = new RateLimiter(100, 60 * 1000);

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!limiter.check(ip)) {
        res.status(429).json({
            message: 'Too many requests, please try again later.',
            remainingRequests: 0,
            resetTime: new Date(limiter.getResetTime(ip)).toISOString()
        });
        return;
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', String(100));
    res.setHeader('X-RateLimit-Remaining', String(limiter.getRemainingRequests(ip)));
    res.setHeader('X-RateLimit-Reset', String(limiter.getResetTime(ip)));

    next();
};