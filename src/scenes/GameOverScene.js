import Phaser from 'phaser';

var replayButton;

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('game-over-scene');
    }

    init(data) {
        this.score = data.score;
    }

    preload() {
        this.load.image('background', 'images/bg_layer1.png');
        this.load.image('gameover', 'images/Game_Over.png');
        this.load.image('replay', 'images/Restart.png');
    }

    create() {
        var bg = this.add.image(0, 0, "background").setOrigin(0, 0);

        var scaleX = this.game.config.width / bg.width;
        var scaleY = this.game.config.height / bg.height;
        bg.setScale(scaleX, scaleY);

        this.add.image(200, 150, "gameover").setScale(0.2);

        replayButton = this.add.image(200, 300, 'replay').setInteractive().setScale(0.3);

        replayButton.on('pointerup', () => {
            this.scene.start('paper-plane-scene');
        }, this);

        const scoreTextLabel = this.add.text(80, 400, "SCORE: ", {
            fontSize: "40px",
            fill: "#fff",
          });
          const scoreValueText = this.add.text(300, 400, this.score, {
            fontSize: "40px",
            fill: "#fff",
          });
    
          const totalWidth = scoreTextLabel.width + scoreValueText.width;
          scoreTextLabel.x = this.game.config.width / 2 - totalWidth / 2;
          scoreValueText.x = scoreTextLabel.x + scoreTextLabel.width;
    }
}
