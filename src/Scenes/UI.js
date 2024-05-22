import "phaser";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UI", active: true });
  }

  init() {
    this.coinsCollected = 0;
  }

  create() {
    // create score text
    this.scoreText = this.add.text(12, 12, `Score: ${this.coinsCollected}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    // create health text
    this.healthText = this.add.text(12, 50, `Health: 3`, {
      fontSize: "32px",
      fill: "#fff",
    });

    this.add.text(12, 70, `Collision for Enemies and Blocked/edge of map`, {
      fontSize: "70px",
      fill: "#fff",
    });

    this.add.text(12, 150, `bug: double speed when walking diagonal`, {
      fontSize: "70px",
      fill: "#fff",
    });

    this.add.text(12, 225, `Remove Bottoms layer add to bg variation layer`, {
      fontSize: "70px",
      fill: "#fff",
    });

    this.add.text(
      12,
      300,
      `Add Decorative collision later for grass and flowers`,
      {
        fontSize: "70px",
        fill: "#fff",
      }
    );

    this.add.text(12, 375, `Add tops layer to map to allow walk behind`, {
      fontSize: "70px",
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
