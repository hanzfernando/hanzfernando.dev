import Phaser from 'phaser'
import { CHAR_COUNT, MOVE_DURATION_MS } from '../constants'

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
    this.load.image('grass-1',  '/pixel/base-tiles/grass-1.png')
    this.load.image('grass-2',  '/pixel/base-tiles/grass-2.png')
    this.load.image('sand',     '/pixel/base-tiles/sand.png')
    this.load.image('water',    '/pixel/base-tiles/water.png')

    this.load.image('tree',     '/pixel/structures/pine_tree.png')
    this.load.image('house',    '/pixel/structures/house-1.png')
    this.load.image('lab',      '/pixel/structures/lab.png')


    this.load.image('ladder-top',     '/pixel/ladder/ladder-top.png')
    this.load.image('ladder-middle',  '/pixel/ladder/ladder-middle.png')
    this.load.image('ladder-bottom',  '/pixel/ladder/ladder-bottom.png')  

    this.load.image('mailbox',        '/pixel/decor/mailbox.png')
    this.load.image('name',           '/pixel/decor/hanz.png')
    this.load.image('flower-pink',    '/pixel/decor/flower-pink.png')
    this.load.image('flower-orange',  '/pixel/decor/flower-orange.png')
    this.load.image('flower-white',   '/pixel/decor/flower-white.png')
    this.load.image('wild_grass',     '/pixel/decor/wild-grass.png')
    this.load.image('flower_bush',    '/pixel/decor/flower_bush-2.png')

    this.load.spritesheet('ledge',              '/pixel/ledge/ledge.png',  { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('ledge-inset',        '/pixel/ledge/ledge-inset.png',  { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('water-corner',       '/pixel/water/water-corner.png',  { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('water-border',       '/pixel/water/water-border.png',  { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('path-sheet',         '/pixel/tile-path/tile-path-1.png',  { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('path-inset',         '/pixel/tile-path/tile-path-inset.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('grass-path-inset',   '/pixel/tile-path/grass-path-inset.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('grass-path',         '/pixel/tile-path/grass-path.png', { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('flower-tiles',       '/pixel/decor/flower-tiles.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet('fence',              '/pixel/decor/fence.png', { frameWidth: 16, frameHeight: 16 })
   
    // Helper to measure an image before Phaser loads it
    const getImageSize = (url: string): Promise<{ w: number; h: number }> =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
        img.onerror = () => resolve({ w: 64, h: 96 }) // fallback: 16×24 per frame at 4×4
        img.src = url
      })

    // Load all 4 character spritesheets, auto-sizing frames from image dimensions / 4×4
    for (let i = 1; i <= CHAR_COUNT; i++) {
      const url = `/pixel/characters/char-${i}-sprite.png`
      const { w, h } = await getImageSize(url)

      this.load.spritesheet(`char-${i}-sheet`, url, {
        frameWidth: Math.floor(w / 4),
        frameHeight: Math.floor(h / 4),
      })
    }
  }

  create(): void {
    // Create walk/idle animations for each character sheet
    const dirs = ['down', 'left', 'right', 'up'] as const
    const cols = 4
    for (let charIdx = 1; charIdx <= CHAR_COUNT; charIdx++) {
      const sheetKey = `char-${charIdx}-sheet`
      for (let row = 0; row < dirs.length; row++) {
        const startFrame = row * cols
        this.anims.create({
          key: `${sheetKey}-walk-${dirs[row]}`,
          frames: this.anims.generateFrameNumbers(sheetKey, {
            start: startFrame,
            end: startFrame + cols - 1,
          }),
          frameRate: Math.round(1000 / MOVE_DURATION_MS * cols),  // was hardcoded 8
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
}