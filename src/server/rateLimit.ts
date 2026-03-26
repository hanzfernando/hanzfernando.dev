interface Bucket {
  tokens: number
  lastRefill: number
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>()
  private maxTokens = 30
  private refillRate = 30 // tokens per second
  private maxIdleMs = 5 * 60_000
  private checksSincePrune = 0

  private pruneStaleBuckets(now: number): void {
    for (const [socketId, bucket] of this.buckets) {
      if (now - bucket.lastRefill > this.maxIdleMs) {
        this.buckets.delete(socketId)
      }
    }
  }

  check(socketId: string): boolean {
    const now = Date.now()
    this.checksSincePrune += 1
    if (this.checksSincePrune >= 500) {
      this.pruneStaleBuckets(now)
      this.checksSincePrune = 0
    }

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
