import "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.health = 3;
    this.speed = 200;

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(10);

    // move our enemy
    this.timeEvent = this.scene.time.addEvent({
      delay: 3000,
      callback: this.move,
      loop: true,
      callbackScope: this,
    });

    this.anims.create({
      key: "walk-down",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 6,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 9,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  loseHealth() {
    this.health--;
    this.tint = 0xff0000;
    if (this.health === 0) {
      this.timeEvent.destroy();
      this.destroy();
    } else {
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.tint = 0xffffff;
        },
      });
    }
  }

  move() {
    const randNumber = Math.floor(Math.random() * 4 + 1);
    this.setVelocity(0); // Reset velocity before applying new direction

    switch (randNumber) {
      case 1:
        this.setVelocityX(this.speed);
        this.anims.play("walk-right", true);
        break;
      case 2:
        this.setVelocityX(-this.speed);
        this.anims.play("walk-left", true);
        break;
      case 3:
        this.setVelocityY(this.speed);
        this.anims.play("walk-down", true);
        break;
      case 4:
        this.setVelocityY(-this.speed);
        this.anims.play("walk-up", true);
        break;
      default:
        this.setVelocityX(this.speed);
        this.anims.play("walk-right", true);
    }

    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.active) {
          this.setVelocity(0);
          this.anims.stop();
        }
      },
      callbackScope: this,
    });
  }
}
