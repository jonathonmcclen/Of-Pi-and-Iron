import "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "PlayerCharacter");
    this.scene = scene;
    this.health = 3;
    this.hitDelay = false;
    this.direction = "up";

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(9.5);

    this.scene.events.emit("playerCreate", this.health);
    this.speed = 500;

    scene.anims.create({
      key: "walk-down",
      frames: scene.anims.generateFrameNumbers("PlayerCharacter", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-left",
      frames: scene.anims.generateFrameNumbers("PlayerCharacter", {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-right",
      frames: scene.anims.generateFrameNumbers("PlayerCharacter", {
        start: 6,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "walk-up",
      frames: scene.anims.generateFrameNumbers("PlayerCharacter", {
        start: 9,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Add an input for the space key
    this.spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Listen for space key events
    this.spaceKey.on("down", () => {
      this.swingSword();
    });
  }

  update(cursors) {
    this.setVelocity(0);

    // Check if the up or down key is pressed
    if (cursors.up.isDown) {
      this.direction = "up";
      this.setVelocityY(-this.speed);
      this.anims.play("walk-up", true);
    } else if (cursors.down.isDown) {
      this.direction = "down";
      this.setVelocityY(this.speed);
      this.anims.play("walk-down", true);
    }

    // Check if the left or right key is pressed
    if (cursors.left.isDown) {
      this.direction = "left";
      this.setVelocityX(-this.speed);
      this.anims.play("walk-left", true);
    } else if (cursors.right.isDown) {
      this.direction = "right";
      this.setVelocityX(this.speed);
      this.anims.play("walk-right", true);
    }

    // Stop animations if no keys are pressed
    if (
      !cursors.up.isDown &&
      !cursors.down.isDown &&
      !cursors.left.isDown &&
      !cursors.right.isDown
    ) {
      this.anims.stop();
    }

    if (this.hitbox) {
      console.log(this.hitbox);
      this.updateHitboxPosition();
    }
  }

  updateHitboxPosition() {
    const offset = this.width + 8 * this.scene.scale; // Adjust offset based on scale

    switch (this.direction) {
      case "up":
        this.hitboxX = this.x;
        this.hitboxY = this.y - offset;
        break;
      case "down":
        this.hitboxX = this.x;
        this.hitboxY = this.y + offset;
        break;
      case "left":
        this.hitboxX = this.x - offset;
        this.hitboxY = this.y;
        break;
      case "right":
        this.hitboxX = this.x + offset;
        this.hitboxY = this.y;
        break;
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

  swingSword() {
    if (this.hitbox) {
      this.hitbox.destroy();
    }
    // Calculate hitbox position based on player's direction
    this.hitboxX = this.x;
    this.hitboxY = this.y;
    const hitboxSize = 100; // Size of the hitbox
    const offset = this.width + 8 * this.scene.scale; // Adjust offset based on scale

    switch (this.direction) {
      case "up":
        this.hitboxY -= offset;
        break;
      case "down":
        this.hitboxY += offset;
        break;
      case "left":
        this.hitboxX -= offset;
        break;
      case "right":
        this.hitboxX += offset;
        break;
    }

    // Create a visible hitbox
    this.hitbox = this.scene.add.rectangle(
      this.hitboxX,
      this.hitboxY,
      hitboxSize,
      hitboxSize,
      0xff0000,
      1
    );
    this.scene.physics.world.enable(this.hitbox);
    this.hitbox.body.setAllowGravity(false);
    this.hitbox.body.immovable = false;

    // // Check collision between hitbox and enemies
    // this.scene.physics.add.overlap(
    //   hitbox,
    //   this.scene.enemies,
    //   (hitbox, enemy) => {
    //     // Handle collision (e.g., damage the enemy)
    //     enemy.destroy(); // Example action: destroy the enemy
    //   }
    // );

    // Destroy the hitbox after a short duration
    this.scene.time.addEvent({
      delay: 100, // Duration in milliseconds
      callback: () => {
        this.hitbox && this.hitbox.destroy();
        this.hitbox = null;
      },
      callbackScope: this,
    });
  }
}
