import "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "characters", 325);
    this.scene = scene;
    this.health = 3;
    this.hitDelay = false;
    this.direction = "up";

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(10);

    this.scene.events.emit("playerCreate", this.health);
    this.speed = 350;
  }

  update(cursors) {
    this.setVelocity(0);
    // check if the up or down key is pressed
    if (cursors.up.isDown) {
      this.direction = "up";
      this.setVelocityY(-this.speed);
    } else if (cursors.down.isDown) {
      this.direction = "down";
      this.setVelocityY(this.speed);
    }
    // check if the left or right key is pressed
    if (cursors.left.isDown) {
      this.direction = "left";
      this.setVelocityX(-this.speed);
    } else if (cursors.right.isDown) {
      this.direction = "right";
      this.setVelocityX(this.speed);
    }
  }

  loseHealth() {
    this.health--;
    this.scene.events.emit("loseHealth", this.health);
    if (this.health === 0) {
      this.scene.loadNextLevel(true);
    }
  }

  enemyCollision(player, enemy) {
    if (!this.hitDelay) {
      this.loseHealth();
      this.hitDelay = true;
      this.tint = 0xff0000;
      this.scene.time.addEvent({
        delay: 1200,
        callback: () => {
          this.hitDelay = false;
          this.tint = 0xffffff;
        },
        callbackScope: this,
      });
    }
  }
}
