import "phaser";

export default class BootScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    this.levels = {
      1: "SetV1",
      2: "level2",
    };
    // load in the tilemap
    this.load.tilemapTiledJSON("SetV1", "assets/tilemaps/SetV1.json");
    this.load.tilemapTiledJSON("level2", "assets/tilemaps/level2.json");
    // load in the spritesheet
    this.load.spritesheet("SetV1", "assets/OverWorld/SetV1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    // load in our character spritesheet
    this.load.spritesheet(
      "characters",
      "assets/images/roguelikeChar_transparent.png",
      { frameWidth: 17, frameHeight: 17 }
    );
    // load our portal sprite
    this.load.image("portal", "assets/images/raft.png");
    // load in our coin sprite
    this.load.image("coin", "assets/images/coin_01.png");
    // load in our bullet sprite
    this.load.image("bullet", "assets/images/ballBlack_04.png");
  }

  create() {
    this.scene.start("Game", { level: 1, newGame: true, levels: this.levels });
  }
}
