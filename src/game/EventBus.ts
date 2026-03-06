type Listener = (...args: unknown[]) => void

class SimpleEventEmitter {
  private listeners = new Map<string, Set<Listener>>()

  on(event: string, fn: Listener): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(fn)
    return this
  }

  off(event: string, fn?: Listener): this {
    if (fn) {
      this.listeners.get(event)?.delete(fn)
    } else {
      this.listeners.delete(event)
    }
    return this
  }

  emit(event: string, ...args: unknown[]): this {
    for (const fn of this.listeners.get(event) ?? []) {
      fn(...args)
    }
    return this
  }
}

export const EventBus = new SimpleEventEmitter()

export const GameEvents = {
  INTERACTION: 'interaction',
  CHAT_SENT: 'chat-sent',
  CHAT_FOCUS: 'chat-focus',
  SCENE_READY: 'scene-ready',
  USERNAME_SET: 'username-set',
} as const
