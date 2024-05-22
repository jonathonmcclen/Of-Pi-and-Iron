import "phaser";

export default class BootScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    //get all levels
    this.levels = {
      1: "SetV1",
      2: "level2",
    };

    // load tilemaps for Levels
    this.load.tilemapTiledJSON("SetV1", "assets/tilemaps/SetV1.json");
    this.load.tilemapTiledJSON("level2", "assets/tilemaps/level2.json");

    // load Level
    this.load.spritesheet("SetV1", "assets/OverWorld/SetV1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // load in our Playercharacter spritesheet
    this.load.spritesheet("PlayerCharacter", "assets/characters/Rogue_M6.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("Rat1", "assets/characters/mics/Rat1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("Rat2", "assets/characters/mics/Rat2.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("Rat3", "assets/characters/mics/Rat3.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("Cat1", "assets/characters/mics/Cat1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet(
      "animals2",
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
