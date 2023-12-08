import Phaser from "phaser";
import FallingObject from "../ui/FallingObject";
import Laser from "../ui/Laser";
import ScoreLabel from "../ui/ScoreLabel";
import LifeLabel from "../ui/LifeLabel";

export default class PaperPlaneScene extends Phaser.Scene {
  constructor() {
    super("paper-plane-scene");
  }

  init() {
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.plane = undefined;
    this.speed = 100;
    this.cursors = undefined;
    this.enemies = undefined;
    this.enemySpeed = 60;
    this.lasers = undefined;
    this.lastFired = 0;
    // init score dan life
    this.scoreLabel = undefined;
    this.lifeLabel = undefined;
    this.life = 3;
  }

  preload() {
    this.load.image("background", "images/background.jpg");
    this.load.image("left-btn", "images/left.png");
    this.load.image("right-btn", "images/right.png");
    this.load.image("shoot-btn", "images/shoot.png");
    this.load.spritesheet("plane", "images/paperplane.png", {
      frameWidth: 66,
      frameHeight: 66,
    });
    this.load.image("enemy", "images/Mob.png");
    this.load.image("laser", "images/bullets.png");
  }

  create() {
    var bg = this.add.image(0, 0, "background").setOrigin(0, 0);

    var scaleX = this.game.config.width / bg.width;
    var scaleY = this.game.config.height / bg.height;
    bg.setScale(scaleX, scaleY);

    this.createButton();

    this.plane = this.createplane();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(2000, 8000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.physics.world.enable([this.lasers, this.enemies]);

    this.physics.add.overlap(
      this.lasers,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
    this.input.keyboard.on("keydown-SPACE", this.shootLaser, this);

    this.physics.add.overlap(
      this.plane,
      this.enemies,
      this.decreaseLife,
      null,
      this
    );
    //score label
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    //life label
    this.lifeLabel = this.createLifeLabel(16, 43, 3);
    this.physics.add.overlap(
      this.plane,
      this.enemies,
      this.decreaseLife,
      null,
      this
    );
  }

  update(time) {
    this.moveplane(time);
    // win
    const targetScore =70;
    if (this.scoreLabel.getScore() >= targetScore) {
      this.handleWin();
    }
  }

  createButton() {
    this.input.addPointer(3);
    this.shootButton = this.add
      .image(320, 550, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.8);
    this.leftButton = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(1.8);
    this.rightButton = this.add
      .image(
        this.leftButton.x + this.leftButton.displayWidth + 20,
        550,
        "right-btn"
      )
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(1.8);

    this.leftButton.on(
      "pointerdown",
      () => {
        this.nav_left = true;
      },
      this
    );
    this.leftButton.on(
      "pointerup",
      () => {
        this.nav_left = false;
      },
      this
    );
    this.rightButton.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    this.rightButton.on(
      "pointerup",
      () => {
        this.nav_right = false;
      },
      this
    );
    this.shootButton.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    this.shootButton.on(
      "pointerup",
      () => {
        this.shoot = false;
      },
      this
    );
  }

  createplane() {
    const plane = this.physics.add.sprite(200, 450, "plane");
    plane.setCollideWorldBounds(true);
    plane.setScale(3);
    return plane;
  }

  moveplane(time) {
    if (this.cursors.left.isDown || this.nav_left) {
      this.plane.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown || this.nav_right) {
      this.plane.setVelocityX(this.speed);
    } else {
      this.plane.setVelocityX(0);
    }
    if (this.cursors.up.isDown) {
      this.plane.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.plane.setVelocityY(160);
    } else if (this.cursors.down.isUp || this.cursors.up.isUp) {
      this.plane.setVelocityY(0);
    }

    if (this.shoot && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.plane.x, this.plane.y);
        this.lastFired = time + 150;
      }
    }
  }

  spawnEnemy() {
    const config = {
      speed: this.enemySpeed,
      rotation: 0,
    };

    const enemy = this.enemies.get(0, 0, "enemy", config);
    if (enemy) {
      const enemyWidth = enemy.displayWidth;
      const positionX = Phaser.Math.Between(
        enemyWidth,
        this.scale.width - enemyWidth
      );
      enemy.spawn(positionX);
      enemy.setScale(2.5)
    }
  }

  hitEnemy(laser, enemy) {
    console.log("Collision detected!");
    laser.erase();
    enemy.die();
    //score label
    this.scoreLabel.add(10);
    if (this.scoreLabel.getScore() % 100 == 0) {
      this.enemySpeed += 10;
    }
  }

  shootLaser() {
    if (this.time.now > this.lastFired) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.plane.x, this.plane.y);
        this.lastFired = this.time.now + 150;
      }
    }
  }
  // score label
  createScoreLabel(x, y, score) {
    const style = {
      fontSize: "20px",
      fill: "#000",
      backgroundColor: "white",
    };
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }
  // life label
  createLifeLabel(x, y, life) {
    const style = { fontSize: "20px", fill: "#000", backgroundColor: "white" };
    const label = new LifeLabel(this, x, y, life, style).setDepth(1);

    this.add.existing(label);

    return label;
  }
  // life
  decreaseLife(plane, enemy) {
    enemy.die();
    this.lifeLabel.subtract(1);

    const currentLife = this.lifeLabel.getLife();

    if (currentLife === 2) {
      plane.setAlpha(1); // If life is 2, set tint and normal alpha
    } else if (currentLife === 1) {
      plane.setAlpha(0.5); // If life is 1, set tint and reduced alpha
    } else if (currentLife === 0) {
      this.scene.start("game-over-scene", {
        score: this.scoreLabel.getScore(),
      });
    }
  }
  //win
  handleWin() {
    this.scene.start("win-scene", {
      score: this.scoreLabel.getScore(),
    });
  }
}
