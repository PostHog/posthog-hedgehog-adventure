import Phaser from 'phaser'
import { Player } from '../entities/Player'

export class Level extends Phaser.Scene {
  private player!: Player
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private dataPoints!: Phaser.Physics.Arcade.StaticGroup
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private startTime = 0
  private totalDataPoints = 0

  constructor() {
    super('Level')
  }

  create() {
    this.score = 0
    this.startTime = Date.now()

    this.cameras.main.setBackgroundColor('#1d4aff')

    this.createBackground()
    this.createPlatforms()
    this.createDataPoints()
    this.createPlayer()
    this.createUI()
    this.setupCollisions()
  }

  private createBackground() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0xffffff, 0.05)
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(50, this.scale.width - 50)
      const y = Phaser.Math.Between(50, this.scale.height - 100)
      const size = Phaser.Math.Between(1, 3)
      graphics.fillCircle(x, y, size)
    }
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup()

    const ground = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 20,
      this.scale.width,
      40,
      0x1e2f46
    )
    this.physics.add.existing(ground, true)
    this.platforms.add(ground)

    const platformData = [
      { x: 150, y: 450, width: 150 },
      { x: 400, y: 380, width: 120 },
      { x: 650, y: 300, width: 150 },
      { x: 300, y: 220, width: 100 },
      { x: 550, y: 150, width: 130 },
      { x: 100, y: 280, width: 80 },
    ]

    platformData.forEach(({ x, y, width }) => {
      const platform = this.add.rectangle(x, y, width, 16, 0xf75a00)
      platform.setStrokeStyle(2, 0xffffff, 0.3)
      this.physics.add.existing(platform, true)
      this.platforms.add(platform)
    })
  }

  private createDataPoints() {
    this.dataPoints = this.physics.add.staticGroup()

    const platformPositions = [
      { x: 150, y: 450 },
      { x: 400, y: 380 },
      { x: 650, y: 300 },
      { x: 300, y: 220 },
      { x: 550, y: 150 },
      { x: 100, y: 280 },
    ]

    const groundPositions = [
      { x: 250, y: this.scale.height - 60 },
      { x: 500, y: this.scale.height - 60 },
      { x: 700, y: this.scale.height - 60 },
    ]

    const allPositions = [
      ...platformPositions.map((p) => ({ x: p.x, y: p.y - 50 })),
      ...groundPositions,
    ]

    this.totalDataPoints = allPositions.length

    allPositions.forEach(({ x, y }) => {
      const dataPoint = this.add.image(x, y, 'data-point')
      dataPoint.setScale(0.18)
      this.physics.add.existing(dataPoint, true)
      this.dataPoints.add(dataPoint, true)

      this.tweens.add({
        targets: dataPoint,
        scale: { from: 0.18, to: 0.2 },
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    })
  }

  private createPlayer() {
    this.player = new Player(this, 100, this.scale.height - 100)
  }

  private createUI() {
    this.scoreText = this.add
      .text(16, 16, '0 / 9', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(100)
      .setAlpha(0.9)
  }

  private setupCollisions() {
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.overlap(
      this.player,
      this.dataPoints,
      (_player, dataPoint) => this.collectDataPoint(dataPoint),
      undefined,
      this
    )
  }

  private collectDataPoint(
    dataPoint:
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
    const dp = dataPoint as Phaser.GameObjects.Image
    dp.destroy()

    this.score++
    this.scoreText.setText(`${this.score} / ${this.totalDataPoints}`)

    if (this.score >= this.totalDataPoints) {
      this.levelComplete()
    }
  }

  private levelComplete() {
    const timeSeconds = Math.floor((Date.now() - this.startTime) / 1000)

    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.5
    )
    overlay.setDepth(150)

    const container = this.add.container(this.scale.width / 2, this.scale.height / 2)
    container.setDepth(200)

    const bg = this.add.rectangle(0, 0, 300, 180, 0xffffff, 1)
    bg.setStrokeStyle(0)

    const title = this.add.text(0, -50, 'nice.', {
      fontSize: '32px',
      color: '#1E2F46',
      fontFamily: 'system-ui, sans-serif',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    const time = this.add.text(0, 0, `${timeSeconds}s`, {
      fontSize: '48px',
      color: '#f75a00',
      fontFamily: 'system-ui, sans-serif',
      fontStyle: 'bold',
    })
    time.setOrigin(0.5)

    const hint = this.add.text(0, 50, 'press space to go again', {
      fontSize: '14px',
      color: '#9CA3AF',
      fontFamily: 'system-ui, sans-serif',
    })
    hint.setOrigin(0.5)

    container.add([bg, title, time, hint])

    this.tweens.add({
      targets: container,
      scale: { from: 0.8, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: 'Back.easeOut',
    })

    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.restart()
    })
  }

  update() {
    if (this.player) {
      this.player.update()

      if (this.player.y > this.scale.height + 100) {
        this.player.setPosition(100, this.scale.height - 100)
        this.player.setVelocity(0, 0)
      }
    }
  }

  changeScene() {
    this.scene.start('Boot')
  }
}
