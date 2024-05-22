import "phaser";

export default class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, children) {
    super(world, scene, children);
    this.scene = scene;

    this.createMultiple({
      frameQuantity: 1,
      key: "bullet",
      active: false,
      visible: false,
    });
  }

  enemyCollision(bullet, enemy) {
    bullet.active = false;
    bullet.visible = false;
    bullet.destroy();
    enemy.loseHealth();
  }

  fireBullet(x, y, direction) {
    const bullet = this.getFirstDead(false);
    if (bullet) {
      this.scene.physics.add.existing(bullet);
      bullet.active = true;
      bullet.visible = true;
      bullet.setPosition(x, y);
      bullet.setScale(0.1);

      switch (direction) {
        case "up":
          bullet.body.setVelocityY(-300);
          break;
        case "down":
          bullet.body.setVelocityY(300);
          break;
        case "left":
          bullet.body.setVelocityX(-300);
          break;
        case "right":
          bullet.body.setVelocityX(300);
          break;
        default:
          bullet.body.setVelocityY(-300);
      }

      this.scene.time.addEvent({
        delay: 1500,
        callback: () => {
          bullet.active = false;
          bullet.visible = false;
          if (bullet) {
            bullet.body.setVelocity(0);
            bullet.destroy();
          }
        },
      });
    }
  }
}
