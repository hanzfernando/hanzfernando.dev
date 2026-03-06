import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  async preload(): Promise<void> {
    // Loading bar
    const { width, height } = this.cameras.main
    const barWidth = 200
    const barHeight = 16
    const barX = (width - barWidth) / 2
    const barY = (height - barHeight) / 2

    const bgBar = this.add.graphics()
    bgBar.fillStyle(0x333333, 1)
    bgBar.fillRect(barX, barY, barWidth, barHeight)

    const progressBar = this.add.graphics()
    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(barX + 2, barY + 2, (barWidth - 4) * value, barHeight - 4)
    })

    this.load.on('complete', () => {
      bgBar.destroy()
      progressBar.destroy()
    })

    // Load static assets
    this.load.image('grass', '/pixel/grass.png')
    this.load.image('tree', '/pixel/tree.png')
    this.load.image('house', '/pixel/house.png')

    // Helper to measure an image before Phaser loads it
    const getImageSize = (url: string): Promise<{ w: number; h: number }> =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
        img.onerror = () => resolve({ w: 64, h: 88 }) // fallback: 16×22 per frame at 4×4
        img.src = url
      })

    // Load all 4 character spritesheets, auto-sizing frames from image dimensions / 4×4
    for (let i = 1; i <= 4; i++) {
      const url = `/pixel/char-${i}-sprite.png`
      const { w, h } = await getImageSize(url)

      this.load.spritesheet(`char-${i}-sheet`, url, {
        frameWidth: Math.floor(w / 4),
        frameHeight: Math.floor(h / 4),
      })
    }
  }

  create(): void {
    // Generate programmatic textures
    this.generatePathTexture()
    this.generatePlayerRemote()
    this.generateMailbox()
    this.generateLabWall()
    this.generateLabRoof()

    // Create walk/idle animations for each character sheet
    const dirs = ['down', 'left', 'right', 'up'] as const
    const cols = 4
    for (let charIdx = 1; charIdx <= 4; charIdx++) {
      const sheetKey = `char-${charIdx}-sheet`
      for (let row = 0; row < dirs.length; row++) {
        const startFrame = row * cols
        this.anims.create({
          key: `${sheetKey}-walk-${dirs[row]}`,
          frames: this.anims.generateFrameNumbers(sheetKey, {
            start: startFrame,
            end: startFrame + cols - 1,
          }),
          frameRate: 8,
          repeat: -1,
        })
        this.anims.create({
          key: `${sheetKey}-idle-${dirs[row]}`,
          frames: [{ key: sheetKey, frame: startFrame }],
          frameRate: 1,
        })
      }
    }

    this.scene.start('GameScene')
  }

  private generatePathTexture(): void {
    const g = this.add.graphics()
    g.fillStyle(0xc4a265, 1)
    g.fillRect(0, 0, 16, 16)
    g.generateTexture('path-tile', 16, 16)
    g.destroy()
  }

  private generatePlayerRemote(): void {
    const g = this.add.graphics()
    g.fillStyle(0x4466aa, 1)
    g.fillRect(1, 1, 14, 14)
    g.lineStyle(1, 0x223366, 1)
    g.strokeRect(1, 1, 14, 14)
    g.fillStyle(0xffffff, 1)
    g.fillCircle(8, 12, 2)
    g.generateTexture('player-remote', 16, 16)
    g.destroy()
  }

  private generateMailbox(): void {
    const g = this.add.graphics()
    g.fillStyle(0x888888, 1)
    g.fillRect(6, 8, 4, 8)
    g.fillStyle(0x8b4513, 1)
    g.fillRect(2, 2, 12, 8)
    g.fillStyle(0xff3333, 1)
    g.fillRect(13, 3, 2, 4)
    g.generateTexture('mailbox-sprite', 16, 16)
    g.destroy()
  }

  private generateLabWall(): void {
    const g = this.add.graphics()
    g.fillStyle(0x7090a0, 1)
    g.fillRect(0, 0, 16, 16)
    g.lineStyle(1, 0x506070, 0.5)
    g.strokeRect(0, 0, 16, 16)
    g.generateTexture('lab-wall', 16, 16)
    g.destroy()
  }

  private generateLabRoof(): void {
    const g = this.add.graphics()
    g.fillStyle(0x405060, 1)
    g.fillRect(0, 0, 16, 16)
    g.generateTexture('lab-roof', 16, 16)
    g.destroy()
  }
}