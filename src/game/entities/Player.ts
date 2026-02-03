import Phaser from 'phaser'
import { EventBus } from '../EventBus'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private jumpCount = 0
  private maxJumps = 1
  private baseSpeed = 200
  private currentSkin = 'default'
  private isOnGround = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const skin = scene.game.registry.get('skin') || 'default'
    super(scene, x, y, `${skin}-walk`, 0)
    this.currentSkin = skin

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.setBounce(0)
    this.setGravityY(400)
    this.setScale(1)
    this.setSize(50, 70)
    this.setOffset(15, 10)

    this.cursors = scene.input.keyboard!.createCursorKeys()

    this.createAnimations(scene)
    this.updateFromFlags()
  }

  private createAnimations(scene: Phaser.Scene) {
    const skins = ['default', 'spiderhog', 'robohog']

    for (const skin of skins) {
      if (!scene.anims.exists(`${skin}-walk`)) {
        scene.anims.create({
          key: `${skin}-walk`,
          frames: scene.anims.generateFrameNumbers(`${skin}-walk`, {
            start: 0,
            end: 10,
          }),
          frameRate: 15,
          repeat: -1,
        })
      }

      if (!scene.anims.exists(`${skin}-jump`)) {
        scene.anims.create({
          key: `${skin}-jump`,
          frames: scene.anims.generateFrameNumbers(`${skin}-jump`, {
            start: 0,
            end: 9,
          }),
          frameRate: 15,
          repeat: 0,
        })
      }

      if (!scene.anims.exists(`${skin}-fall`)) {
        scene.anims.create({
          key: `${skin}-fall`,
          frames: scene.anims.generateFrameNumbers(`${skin}-fall`, {
            start: 0,
            end: 8,
          }),
          frameRate: 15,
          repeat: -1,
        })
      }

      if (!scene.anims.exists(`${skin}-idle`)) {
        scene.anims.create({
          key: `${skin}-idle`,
          frames: [{ key: `${skin}-walk`, frame: 0 }],
          frameRate: 1,
        })
      }
    }
  }

  updateFromFlags() {
    const doubleJump = this.scene.game.registry.get('doubleJumpEnabled')
    const speedBoost = this.scene.game.registry.get('speedBoostEnabled')
    const newSkin = this.scene.game.registry.get('skin') || 'default'

    this.maxJumps = doubleJump ? 2 : 1
    this.baseSpeed = speedBoost ? 300 : 200

    if (newSkin !== this.currentSkin) {
      this.currentSkin = newSkin
      const currentAnim = this.anims.currentAnim?.key?.split('-')[1] || 'idle'
      this.play(`${this.currentSkin}-${currentAnim}`)
    }
  }

  update() {
    this.updateFromFlags()
    const body = this.body as Phaser.Physics.Arcade.Body
    this.isOnGround = body.blocked.down || body.touching.down

    if (this.isOnGround) {
      this.jumpCount = 0
    }

    const speed = this.baseSpeed

    if (this.cursors.left.isDown) {
      this.setVelocityX(-speed)
      this.setFlipX(true)
      if (this.isOnGround) {
        this.play(`${this.currentSkin}-walk`, true)
      }
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(speed)
      this.setFlipX(false)
      if (this.isOnGround) {
        this.play(`${this.currentSkin}-walk`, true)
      }
    } else {
      this.setVelocityX(0)
      if (this.isOnGround) {
        this.play(`${this.currentSkin}-idle`, true)
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.jump()
    }

    if (!this.isOnGround) {
      if (body.velocity.y < 0) {
        this.play(`${this.currentSkin}-jump`, true)
      } else {
        this.play(`${this.currentSkin}-fall`, true)
      }
    }
  }

  private jump() {
    if (this.jumpCount < this.maxJumps) {
      this.setVelocityY(-450)
      this.jumpCount++

      EventBus.emit('posthog-event', {
        event: 'player_jumped',
        properties: {
          jumpNumber: this.jumpCount,
          isDoubleJump: this.jumpCount > 1,
          skin: this.currentSkin,
        },
      })
    }
  }

  die(cause: string) {
    EventBus.emit('posthog-event', {
      event: 'player_died',
      properties: {
        cause,
        skin: this.currentSkin,
      },
    })
  }
}
