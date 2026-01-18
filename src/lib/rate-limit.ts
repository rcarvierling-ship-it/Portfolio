export interface RateLimitConfig {
    interval: number; // Window size in milliseconds
    limit: number;    // Max requests per window
}

const trackers: Record<string, { count: number, resetAt: number }> = {};

export function checkRateLimit(ip: string, action: string, config: RateLimitConfig): boolean {
    // Basic in-memory rate limit. In serverless this might reset on cold boot, 
    // but sufficient for a single-instance VPS or light traffic.
    const key = `${ip}:${action}`;
    const now = Date.now();

    if (!trackers[key] || now > trackers[key].resetAt) {
        trackers[key] = {
            count: 1,
            resetAt: now + config.interval
        };
        return true;
    }

    if (trackers[key].count >= config.limit) {
        return false;
    }

    trackers[key].count++;
    return true;
}

// Clean up old trackers periodically to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const key in trackers) {
        if (now > trackers[key].resetAt) {
            delete trackers[key];
        }
    }
}, 60000); // Check every minute
