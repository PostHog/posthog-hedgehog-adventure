import Phaser from 'phaser'

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    const skin = this.game.registry.get('skin') || 'default'
    this.loadSkinSprites(skin)

    if (skin !== 'default') {
      this.loadSkinSprites('default')
    }
    if (skin !== 'spiderhog') {
      this.loadSkinSprites('spiderhog')
    }
    if (skin !== 'robohog') {
      this.loadSkinSprites('robohog')
    }

    this.load.image('star-hog', '/assets/collectibles/star-hog.png')
  }

  loadSkinSprites(skinName: string) {
    const frameConfig = { frameWidth: 80, frameHeight: 80 }
    this.load.spritesheet(
      `${skinName}-walk`,
      `/assets/sprites/skins/${skinName}/walk.png`,
      frameConfig
    )
    this.load.spritesheet(
      `${skinName}-jump`,
      `/assets/sprites/skins/${skinName}/jump.png`,
      frameConfig
    )
    this.load.spritesheet(
      `${skinName}-fall`,
      `/assets/sprites/skins/${skinName}/fall.png`,
      frameConfig
    )
  }

  create() {
    this.scene.start('Level')
  }
}
