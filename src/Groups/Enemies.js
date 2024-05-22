import "phaser";
import Enemy from "../Sprites/Enemy";

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, children, spriteArray) {
    super(world, scene, children);
    this.scene = scene;
    // this.spriteFrames = [0, 1, 54, 55, 108, 109, 162, 163];

    // create our enemies from the sprite array
    this.createEnemies(scene, spriteArray);
  }

  createEnemies(scene, spriteArray) {
    spriteArray.forEach((sprite) => {
      let enemy;
      switch (sprite.name) {
        case "Rat":
          enemy = new Enemy(scene, sprite.x * 10, sprite.y * 10, "Rat1");
          break;
        case "Squirrel":
          enemy = new Enemy(scene, sprite.x * 10, sprite.y * 10, "Rat2");
          break;
        case "Rabbit":
          enemy = new Enemy(scene, sprite.x * 10, sprite.y * 10, "Rat3");
          break;
        case "mtnLion":
          enemy = new Enemy(scene, sprite.x * 10, sprite.y * 10, "Cat1");
          break;
        default:
          enemy = new Enemy(scene, sprite.x * 10, sprite.y * 10, "Rat3");
      }
      // const randNumber = Math.floor(
      //   Math.random() * this.spriteFrames.length - 1
      // );
      // create a new enemy
      // add to our group
      this.add(enemy);
      // destroy the sprite
      sprite.destroy();
    });
  }
}
