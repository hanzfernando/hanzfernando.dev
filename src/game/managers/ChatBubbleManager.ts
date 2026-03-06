import Phaser from 'phaser'

interface ChatBubble {
  id: string
  container: Phaser.GameObjects.Container
  target: Phaser.GameObjects.Sprite
  timer: Phaser.Time.TimerEvent
}

export class ChatBubbleManager {
  private scene: Phaser.Scene
  private bubbles = new Map<string, ChatBubble>()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  show({ id, sprite, message }: { id: string; sprite: Phaser.GameObjects.Sprite; message: string }): void {
    // Dismiss existing bubble for this id
    this.dismiss(id)

    const container = this.scene.add.container(sprite.x, sprite.y - 24)
    container.setDepth(100)

    // Background
    const padding = 6
    const text = this.scene.add.text(0, 0, message, {
      fontSize: '7px',
      color: '#000000',
      wordWrap: { width: 80 },
      align: 'center',
    })
    text.setOrigin(0.5, 0.5)

    const bgWidth = Math.max(text.width + padding * 2, 20)
    const bgHeight = text.height + padding * 2

    const bg = this.scene.add.graphics()
    bg.fillStyle(0xffffff, 1)
    bg.fillRoundedRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight, 4)

    // Triangle tail
    const tail = this.scene.add.graphics()
    tail.fillStyle(0xffffff, 1)
    tail.fillTriangle(-3, bgHeight / 2, 3, bgHeight / 2, 0, bgHeight / 2 + 4)

    container.add([bg, tail, text])
    container.setAlpha(0)

    // Fade in
    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      duration: 150,
    })

    // Auto-dismiss timer
    const timer = this.scene.time.delayedCall(4000, () => {
      this.fadeOutAndDestroy(id)
    })

    this.bubbles.set(id, { id, container, target: sprite, timer })
  }

  update(): void {
    for (const bubble of this.bubbles.values()) {
      if (bubble.target.active) {
        bubble.container.setPosition(bubble.target.x, bubble.target.y - 24)
      }
    }
  }

  dismiss(id: string): void {
    const bubble = this.bubbles.get(id)
    if (!bubble) return
    bubble.timer.destroy()
    bubble.container.destroy()
    this.bubbles.delete(id)
  }

  private fadeOutAndDestroy(id: string): void {
    const bubble = this.bubbles.get(id)
    if (!bubble) return

    this.scene.tweens.add({
      targets: bubble.container,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        bubble.container.destroy()
        this.bubbles.delete(id)
      },
    })
  }

  destroy(): void {
    for (const bubble of this.bubbles.values()) {
      bubble.timer.destroy()
      bubble.container.destroy()
    }
    this.bubbles.clear()
  }
}
