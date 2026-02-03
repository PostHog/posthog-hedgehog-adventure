import Phaser from 'phaser'

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    const frameConfig = { frameWidth: 80, frameHeight: 80 }
    this.load.spritesheet(
      'default-walk',
      '/assets/sprites/skins/default/walk.png',
      frameConfig
    )
    this.load.spritesheet(
      'default-jump',
      '/assets/sprites/skins/default/jump.png',
      frameConfig
    )
    this.load.spritesheet(
      'default-fall',
      '/assets/sprites/skins/default/fall.png',
      frameConfig
    )

    this.load.image('data-point', '/assets/collectibles/posthog-icon.png')
  }

  create() {
    this.scene.start('Level')
  }
}
