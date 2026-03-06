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

  show({ id, sprite, message }: { id: string; sprite: Phaser.GameObjects.Sprite; message: string }): void {
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
    el.style.background = 'rgba(255,255,255,0.95)'
    el.style.color = '#000'
    el.style.borderRadius = '6px'
    el.style.border = '1px solid rgba(0,0,0,0.6)'
    el.style.fontSize = '13px'
    el.style.transform = 'translate(-50%, -110%)'
    el.style.textAlign = 'center'
    el.innerText = message

    this.overlay.appendChild(el)

    // Fade in
    requestAnimationFrame(() => (el.style.opacity = '1'))

    const timer = this.scene.time.delayedCall(4000, () => {
      this.fadeOutAndDestroy(id)
    })

    this.bubbles.set(id, { id, el, target: sprite, timer })
  }

  createNametag(id: string, sprite: Phaser.GameObjects.Sprite, username: string): void {
    // Remove existing
    this.removeNametag(id)

    const el = document.createElement('div')
    el.className = 'phaser-nametag ui-text'
    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.whiteSpace = 'nowrap'
    el.style.padding = '2px 6px'
    el.style.background = 'rgba(0,0,0,0.6)'
    el.style.color = '#fff'
    el.style.borderRadius = '4px'
    el.style.fontSize = '12px'
    el.style.transform = 'translate(-50%, -100%)'
    el.innerText = username

    this.overlay.appendChild(el)
    this.nametags.set(id, { id, el, target: sprite })
  }

  removeNametag(id: string): void {
    const entry = this.nametags.get(id)
    if (!entry) return
    entry.el.remove()
    this.nametags.delete(id)
  }

  update(): void {
    const canvas = this.scene.game.canvas
    const canvasRect = canvas.getBoundingClientRect()
    const overlayRect = this.overlay.getBoundingClientRect()
    const cam = this.scene.cameras.main

    // Scale factor: Phaser renders at internal resolution (e.g. 640×480) but
    // the canvas is displayed at a larger CSS size via FIT mode. Every canvas
    // pixel must be multiplied by this factor to get an overlay CSS pixel.
    const scaleX = canvasRect.width / canvas.width
    const scaleY = canvasRect.height / canvas.height

    // Offset between the canvas top-left and the overlay top-left in CSS pixels.
    const offsetX = canvasRect.left - overlayRect.left
    const offsetY = canvasRect.top - overlayRect.top

    for (const b of this.bubbles.values()) {
      if (!b.target.active) continue
      const worldX = b.target.x
      const worldY = b.target.y - 24
      const screenX = (worldX - cam.worldView.x) * cam.zoom * scaleX + offsetX
      const screenY = (worldY - cam.worldView.y) * cam.zoom * scaleY + offsetY
      b.el.style.left = `${Math.round(screenX)}px`
      b.el.style.top = `${Math.round(screenY)}px`
    }

    for (const n of this.nametags.values()) {
      if (!n.target.active) continue
      const worldX = n.target.x
      const worldY = n.target.y - 14
      const screenX = (worldX - cam.worldView.x) * cam.zoom * scaleX + offsetX
      const screenY = (worldY - cam.worldView.y) * cam.zoom * scaleY + offsetY
      n.el.style.left = `${Math.round(screenX)}px`
      n.el.style.top = `${Math.round(screenY)}px`
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
