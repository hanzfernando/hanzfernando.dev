import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
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

    // Load sprite assets
    this.load.image('grass', '/pixel/grass.png')
    this.load.image('tree', '/pixel/tree.png')
    this.load.image('house', '/pixel/house.png')
  }

  create(): void {
    // Generate programmatic textures
    this.generatePathTexture()
    this.generatePlayerLocal()
    this.generatePlayerRemote()
    this.generateMailbox()
    this.generateLabWall()
    this.generateLabRoof()

    this.scene.start('GameScene')
  }

  private generatePathTexture(): void {
    const g = this.add.graphics()
    g.fillStyle(0xc4a265, 1)
    g.fillRect(0, 0, 16, 16)
    g.generateTexture('path-tile', 16, 16)
    g.destroy()
  }

  private generatePlayerLocal(): void {
    const g = this.add.graphics()
    g.fillStyle(0x44aa44, 1)
    g.fillRect(1, 1, 14, 14)
    g.lineStyle(1, 0x226622, 1)
    g.strokeRect(1, 1, 14, 14)
    // Direction indicator (dot at bottom for "down")
    g.fillStyle(0xffffff, 1)
    g.fillCircle(8, 12, 2)
    g.generateTexture('player-local', 16, 16)
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
    // Post
    g.fillStyle(0x888888, 1)
    g.fillRect(6, 8, 4, 8)
    // Box
    g.fillStyle(0x8b4513, 1)
    g.fillRect(2, 2, 12, 8)
    // Flag
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
