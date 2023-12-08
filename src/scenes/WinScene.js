import Phaser from "phaser";
var replayButton;

export default class WinScene extends Phaser.Scene {
  constructor() {
    super('win-scene');
  }

  init(data) {
    this.score = data.score;
  }

  preload() {
    this.load.image("background", "images/bg2.png");
    this.load.image("win", "images/youwin.png");
    this.load.image("replay", "images/Restart.png");
  }

  create() {
    var bg = this.add.image(0, 0, "background").setOrigin(0, 0);

    var scaleX = this.game.config.width / bg.width;
    var scaleY = this.game.config.height / bg.height;
    bg.setScale(scaleX, scaleY);

    this.add.image(200, 150, "win").setScale(0.5);
    // Create the replay button and assign it to the replayButton variable
    replayButton = this.add.image(200, 300, "replay").setInteractive().setScale(0.3);

    // Set up the replay button event listener
    replayButton.on(
      "pointerup",
      () => {
        this.scene.start("paper-plane-scene");
      },
      this
    );

    // Create the SCORE: text
    const scoreTextLabel = this.add.text(80, 400, "SCORE: ", {
      fontSize: "40px",
      fill: "#fff",
    });
    const scoreValueText = this.add.text(300, 400, this.score, {
      fontSize: "40px",
      fill: "#fff",
    });

    // Calculate the total width of both text elements
    const totalWidth = scoreTextLabel.width + scoreValueText.width;
    scoreTextLabel.x = this.game.config.width / 2 - totalWidth / 2;
    scoreValueText.x = scoreTextLabel.x + scoreTextLabel.width;
  }
}
