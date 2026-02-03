import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private jumpCount = 0
  private maxJumps = 2
  private speed = 300
  private isOnGround = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'default-walk', 0)

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
  }

  private createAnimations(scene: Phaser.Scene) {
    if (!scene.anims.exists('default-walk')) {
      scene.anims.create({
        key: 'default-walk',
        frames: scene.anims.generateFrameNumbers('default-walk', {
          start: 0,
          end: 10,
        }),
        frameRate: 15,
        repeat: -1,
      })
    }

    if (!scene.anims.exists('default-jump')) {
      scene.anims.create({
        key: 'default-jump',
        frames: scene.anims.generateFrameNumbers('default-jump', {
          start: 0,
          end: 9,
        }),
        frameRate: 15,
        repeat: 0,
      })
    }

    if (!scene.anims.exists('default-fall')) {
      scene.anims.create({
        key: 'default-fall',
        frames: scene.anims.generateFrameNumbers('default-fall', {
          start: 0,
          end: 8,
        }),
        frameRate: 15,
        repeat: -1,
      })
    }

    if (!scene.anims.exists('default-idle')) {
      scene.anims.create({
        key: 'default-idle',
        frames: [{ key: 'default-walk', frame: 0 }],
        frameRate: 1,
      })
    }
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body
    this.isOnGround = body.blocked.down || body.touching.down

    if (this.isOnGround) {
      this.jumpCount = 0
    }

    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed)
      this.setFlipX(true)
      if (this.isOnGround) {
        this.play('default-walk', true)
      }
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed)
      this.setFlipX(false)
      if (this.isOnGround) {
        this.play('default-walk', true)
      }
    } else {
      this.setVelocityX(0)
      if (this.isOnGround) {
        this.play('default-idle', true)
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.jump()
    }

    if (!this.isOnGround) {
      if (body.velocity.y < 0) {
        this.play('default-jump', true)
      } else {
        this.play('default-fall', true)
      }
    }
  }

  private jump() {
    if (this.jumpCount < this.maxJumps) {
      this.setVelocityY(-450)
      this.jumpCount++
    }
  }
}
