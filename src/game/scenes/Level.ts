import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { EventBus } from '../EventBus'

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

    this.cameras.main.setBackgroundColor('#1d4ed8')

    this.createBackground()
    this.createPlatforms()
    this.createDataPoints()
    this.createPlayer()
    this.createUI()
    this.setupCollisions()

    const skin = this.game.registry.get('skin') || 'default'
    const doubleJump = this.game.registry.get('doubleJumpEnabled') || false
    const speedBoost = this.game.registry.get('speedBoostEnabled') || false

    EventBus.emit('posthog-event', {
      event: 'game_started',
      properties: {
        skin,
        doubleJumpEnabled: doubleJump,
        speedBoostEnabled: speedBoost,
        level: 1,
      },
    })

    EventBus.emit('current-scene-ready', this)
  }

  private createBackground() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0x60a5fa, 0.3)
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 100
      graphics.fillRect(0, y, this.scale.width, 2)
    }

    graphics.fillStyle(0xffffff, 0.1)
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(50, this.scale.width - 50)
      const y = Phaser.Math.Between(50, this.scale.height - 100)
      const size = Phaser.Math.Between(2, 6)
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
      0x22c55e
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
      const platform = this.add.rectangle(x, y, width, 20, 0x16a34a)
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
      const dataPoint = this.add.circle(x, y, 15, 0xf59e0b)
      this.physics.add.existing(dataPoint, true)
      this.dataPoints.add(dataPoint, true)

      this.tweens.add({
        targets: dataPoint,
        scale: { from: 1, to: 1.2 },
        duration: 500,
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
      .text(16, 16, 'Data Points: 0', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(100)

    this.add
      .text(16, 50, 'Arrow keys to move, Up to jump', {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setScrollFactor(0)
      .setDepth(100)
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
    const dp = dataPoint as Phaser.GameObjects.Arc
    dp.destroy()

    this.score++
    this.scoreText.setText(`Data Points: ${this.score}`)

    EventBus.emit('posthog-event', {
      event: 'item_collected',
      properties: {
        item_type: 'data_point',
        total: this.score,
      },
    })

    if (this.score >= this.totalDataPoints) {
      this.levelComplete()
    }
  }

  private levelComplete() {
    const timeSeconds = Math.floor((Date.now() - this.startTime) / 1000)

    EventBus.emit('posthog-event', {
      event: 'level_completed',
      properties: {
        level: 1,
        time_seconds: timeSeconds,
        score: this.score,
        skin: this.game.registry.get('skin') || 'default',
      },
    })

    const winText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `Level Complete!\nTime: ${timeSeconds}s\nPress SPACE to restart`,
        {
          fontSize: '32px',
          color: '#ffffff',
          fontFamily: 'Arial',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5)
      .setDepth(200)

    this.tweens.add({
      targets: winText,
      scale: { from: 0, to: 1 },
      duration: 500,
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
        this.player.die('fall')
        this.player.setPosition(100, this.scale.height - 100)
        this.player.setVelocity(0, 0)
      }
    }
  }

  changeScene() {
    this.scene.start('Boot')
  }
}
