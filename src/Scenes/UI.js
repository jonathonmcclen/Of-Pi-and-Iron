import "phaser";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UI", active: true });
  }

  init() {
    this.coinsCollected = 0;
  }

  create() {
    let todo = [
      "Collision for Enemies edge of map",
      "add 1 town",
      "add 3 surrounding areas CC, CD, and DD",
      "bug: double speed when walking diagonal",
      "Add crushed grass texture",
      "add click interaction for enemies",
      "add sword attack collision",
      "Docile Creatures class extension ",
    ];

    for (let i = 0; i < todo.length; i++) {
      let space = i;
      this.add.text(12, 70 * space, todo[i], {
        fontSize: "70px",
        fill: "red",
      });
    }

    this.scoreText = this.add.text(12, 12, `Score: ${this.coinsCollected}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    // create health text
    this.healthText = this.add.text(12, 50, `Health: 3`, {
      fontSize: "32px",
      fill: "#fff",
    });

    // get a reference to the game scene
    this.gameScene = this.scene.get("Game");

    // listen for events from that scene
    this.gameScene.events.on("coinCollected", () => {
      this.coinsCollected++;
      this.scoreText.setText(`Score: ${this.coinsCollected}`);
    });

    this.gameScene.events.on("loseHealth", (health) => {
      this.healthText.setText(`Health: ${health}`);
    });

    this.gameScene.events.on("playerCreate", (health) => {
      this.healthText.setText(`Health: ${health}`);
    });

    this.gameScene.events.on("newGame", () => {
      this.coinsCollected = 0;
      this.scoreText.setText(`Score: ${this.coinsCollected}`);
      this.healthText.setText(`Health: 3`);
    });
  }
}
