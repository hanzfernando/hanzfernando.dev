import Phaser from 'phaser'

interface BubbleEntry {
  id: string
  el: HTMLElement
  target: Phaser.GameObjects.Sprite
  timer?: Phaser.Time.TimerEvent
}

interface NametagEntry {
  id: string
  el: HTMLElement
  target: Phaser.GameObjects.Sprite
}

export class ChatBubbleManager {
  private scene: Phaser.Scene
  private bubbles = new Map<string, BubbleEntry>()
  private nametags = new Map<string, NametagEntry>()
  private overlay: HTMLElement

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    // Create an overlay div positioned over the Phaser canvas to render crisp HTML text
    const canvas = this.scene.game.canvas
    const parent = canvas.parentElement ?? document.body
    const overlay = document.createElement('div')
    overlay.className = 'phaser-overlay'
    Object.assign(overlay.style, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'visible',
      zIndex: '60',
    })
    parent.appendChild(overlay)
    this.overlay = overlay
  }

  show({ id, sprite, message, isLocal }: { id: string; sprite: Phaser.GameObjects.Sprite; message: string; isLocal?: boolean }): void {
    // Dismiss existing
    this.dismiss(id)

    const el = document.createElement('div')
    el.className = 'phaser-chat-bubble ui-text'
    el.style.position = 'absolute'
    el.style.pointerEvents = 'auto'
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.15s'
    el.style.whiteSpace = 'normal'
    el.style.maxWidth = '180px'
    el.style.padding = '6px 8px'
    el.style.background = isLocal ? 'rgba(220,255,230,0.97)' : 'rgba(255,255,255,0.95)'
    el.style.color = '#000'
    el.style.borderRadius = '6px'
    el.style.border = isLocal ? '1.5px solid rgba(34,197,94,0.9)' : '1px solid rgba(0,0,0,0.6)'
    el.style.fontSize = '13px'
    el.style.transform = 'translate(-50%, -110%)'
    el.style.textAlign = 'center'
    el.innerText = message

    // Set initial position synchronously before appending so it never flashes at (0,0)
    const { x, y } = this.toOverlayCoords(sprite.x, sprite.y - 24)
    el.style.left = `${Math.round(x)}px`
    el.style.top = `${Math.round(y)}px`

    this.overlay.appendChild(el)

    // Fade in after position is set
    requestAnimationFrame(() => (el.style.opacity = '1'))

    const timer = this.scene.time.delayedCall(4000, () => {
      this.fadeOutAndDestroy(id)
    })

    this.bubbles.set(id, { id, el, target: sprite, timer })
  }

  createNametag(id: string, sprite: Phaser.GameObjects.Sprite, username: string, isLocal?: boolean): void {
    // Remove existing
    this.removeNametag(id)

    const el = document.createElement('div')
    el.className = 'phaser-nametag ui-text'
    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.whiteSpace = 'nowrap'
    el.style.padding = '2px 6px'
    el.style.background = isLocal ? 'rgba(34,197,94,0.85)' : 'rgba(255, 255, 255, 0.6)'
    el.style.color = '#000'
    el.style.borderRadius = '4px'
    el.style.fontSize = '12px'
    el.style.transform = 'translate(-50%, -100%)'
    el.innerText = username

    // Set initial position synchronously
    const { x, y } = this.toOverlayCoords(sprite.x, sprite.y - 14)
    el.style.left = `${Math.round(x)}px`
    el.style.top = `${Math.round(y)}px`

    this.overlay.appendChild(el)
    this.nametags.set(id, { id, el, target: sprite })
  }

  removeNametag(id: string): void {
    const entry = this.nametags.get(id)
    if (!entry) return
    entry.el.remove()
    this.nametags.delete(id)
  }

  /** Convert Phaser world coords to overlay CSS coords. */
  private toOverlayCoords(worldX: number, worldY: number): { x: number; y: number } {
    const canvas = this.scene.game.canvas
    const canvasRect = canvas.getBoundingClientRect()
    const overlayRect = this.overlay.getBoundingClientRect()
    const cam = this.scene.cameras.main
    const scaleX = canvasRect.width / canvas.width
    const scaleY = canvasRect.height / canvas.height
    const offsetX = canvasRect.left - overlayRect.left
    const offsetY = canvasRect.top - overlayRect.top
    return {
      x: (worldX - cam.worldView.x) * cam.zoom * scaleX + offsetX,
      y: (worldY - cam.worldView.y) * cam.zoom * scaleY + offsetY,
    }
  }

  update(): void {
    for (const b of this.bubbles.values()) {
      if (!b.target.active) continue
      const { x, y } = this.toOverlayCoords(b.target.x, b.target.y - 24)
      b.el.style.left = `${Math.round(x)}px`
      b.el.style.top = `${Math.round(y)}px`
    }

    for (const n of this.nametags.values()) {
      if (!n.target.active) continue
      const { x, y } = this.toOverlayCoords(n.target.x, n.target.y - 7)
      n.el.style.left = `${Math.round(x)}px`
      n.el.style.top = `${Math.round(y)}px`
    }
  }

  dismiss(id: string): void {
    const b = this.bubbles.get(id)
    if (!b) return
    b.timer?.destroy()
    b.el.remove()
    this.bubbles.delete(id)
  }

  private fadeOutAndDestroy(id: string): void {
    const b = this.bubbles.get(id)
    if (!b) return
    b.el.style.opacity = '0'
    setTimeout(() => {
      b.el.remove()
      this.bubbles.delete(id)
    }, 300)
  }

  destroy(): void {
    for (const b of this.bubbles.values()) {
      b.timer?.destroy()
      b.el.remove()
    }
    this.bubbles.clear()
    for (const n of this.nametags.values()) {
      n.el.remove()
    }
    this.nametags.clear()
    this.overlay.remove()
  }
}
