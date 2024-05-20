import "phaser";

export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: window.innerWidth,
  height: window.innerHeight,
  mode: Phaser.Scale.RESIZE,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
};
