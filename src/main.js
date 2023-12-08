import Phaser from 'phaser'

import PaperPlaneScene from './scenes/PaperPlaneScene'
import GameOverScene from './scenes/GameOverScene'
import WinScene from './scenes/WinScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 620,
	physics: {
		default: 'arcade',
		// arcade: {
		// 	gravity: { y: 200 },
		// },
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH 
	},
	scene: [PaperPlaneScene, GameOverScene, WinScene],
}

export default new Phaser.Game(config)
