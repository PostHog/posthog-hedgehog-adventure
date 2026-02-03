import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Level } from './scenes/Level'

export interface GameConfig {
  doubleJumpEnabled: boolean
  speedBoostEnabled: boolean
  skin: string
}

export function createGame(
  parent: string,
  config: GameConfig
): Phaser.Game {
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    backgroundColor: '#1d4ed8',
    audio: {
      noAudio: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 300 },
        debug: false,
      },
    },
    scene: [Boot, Level],
  }

  const game = new Phaser.Game(gameConfig)

  game.registry.set('doubleJumpEnabled', config.doubleJumpEnabled)
  game.registry.set('speedBoostEnabled', config.speedBoostEnabled)
  game.registry.set('skin', config.skin)

  return game
}
