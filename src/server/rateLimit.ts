interface Bucket {
  tokens: number
  lastRefill: number
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>()
  private maxTokens = 30
  private refillRate = 30 // tokens per second

  check(socketId: string): boolean {
    const now = Date.now()
    let bucket = this.buckets.get(socketId)

    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: now }
      this.buckets.set(socketId, bucket)
    }

    const elapsed = (now - bucket.lastRefill) / 1000
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + elapsed * this.refillRate)
    bucket.lastRefill = now

    if (bucket.tokens < 1) return false

    bucket.tokens -= 1
    return true
  }

  cleanup(socketId: string): void {
    this.buckets.delete(socketId)
  }
}
