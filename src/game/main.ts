import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Level } from './scenes/Level'

export function createGame(parent: string): Phaser.Game {
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

  return new Phaser.Game(gameConfig)
}
