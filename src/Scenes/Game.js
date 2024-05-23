import "phaser";
import Player from "../Sprites/Player";
import Portal from "../Sprites/Portal";
import Coins from "../Groups/Coins";
import Enemies from "../Groups/Enemies";
import Bullets from "../Groups/Bullets";

export default class GameScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init(data) {
    console.log(data);

    this._LEVEL = data.level;
    this._LEVELS = data.levels;
    this._NEWGAME = data.newGame;
    this.loadingLevel = false;
    if (this._NEWGAME) this.events.emit("newGame");
    this.scale = 10;
  }

  create() {
    // listen for player input

    this.cursors = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      one: "1",
      two: "2",
      three: "3",
      four: "4",
      five: "5",
      six: "6",
      seven: "7",
      eight: "8",
      nine: "9",
      zero: "0",
    });

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.shiftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    // Draw Order
    this.createMap();
    this.drawBottoms();
    this.createPlayer();

    // creating the portal
    this.createPortal();

    // creating the coins
    this.coins = this.map.createFromObjects("Coins", "Coin", { key: "coin" });
    this.coinsGroup = new Coins(this.physics.world, this, [], this.coins);

    // Grab map bound Immediately
    this.mapBounds = {
      left: 0,
      right: this.map.widthInPixels * 10,
      top: 0,
      bottom: this.map.heightInPixels * 10,
    };

    console.log(this.mapBounds);

    // creating the enemies
    this.enemies = this.map.createFromObjects("Enemies", "Enemy", {});
    this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies);

    this.drawTops();
    this.bullets = new Bullets(this.physics.world, this, []);

    // add collisions
    this.addCollisions();

    // update our camera
    this.cameras.main.startFollow(this.player);
  }

  update() {
    this.checkBoundaryCollision(this.player);

    // this.checkBoundaryCollision(this.);

    this.player.update(this.cursors);

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.bullets.fireBullet(
        this.player.x,
        this.player.y,
        this.player.direction
      );
    } else if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      this.bullets.fireBullet(
        this.player.x,
        this.player.y,
        this.player.direction
      );
    }
  }

  checkBoundaryCollision(sprite) {
    // Check if the sprite is outside the map bounds
    if (sprite.x - 8 * this.scale < this.mapBounds.left) {
      sprite.x = this.mapBounds.left + 8 * this.scale;
      console.log("LEft");
    } else if (sprite.x + 8 * this.scale > this.mapBounds.right) {
      sprite.x = this.mapBounds.right - 8 * this.scale;
      console.log("Right");
    }

    if (sprite.y - 8 * 10 < this.mapBounds.top) {
      sprite.y = this.mapBounds.top + 8 * this.scale;
      console.log("top");
    } else if (sprite.y + 8 * 10 > this.mapBounds.bottom) {
      sprite.y = this.mapBounds.bottom - 8 * this.scale;
      console.log("Bottom");
    }
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.blockedLayer);
    this.physics.add.collider(this.player, this.topLayer);
    this.physics.add.collider(this.player, this.bottomLayer);

    this.physics.add.collider(
      this.player,
      this.decorLayer,
      this.handleTileCollision
      // null,
      // this
    );

    // this.physics.add.overlap(
    //   this.player.swordHitbox,
    //   this.enemies,
    //   this.handleSwordHitboxEnemyCollision,
    //   null,
    //   this
    // );

    this.physics.add.collider(this.enemiesGroup, this.blockedLayer);
    this.physics.add.collider(this.enemiesGroup, this.topLayer);
    this.physics.add.collider(this.enemiesGroup, this.bottomLayer);
    this.physics.add.overlap(
      this.player,
      this.enemiesGroup,
      this.player.enemyCollision.bind(this.player)
    );
    this.physics.add.overlap(
      this.player,
      this.portal,
      this.loadNextLevel.bind(this, false)
    );
    this.physics.add.overlap(
      this.coinsGroup,
      this.player,
      this.coinsGroup.collectCoin.bind(this.coinsGroup)
    );
    this.physics.add.overlap(
      this.bullets,
      this.enemiesGroup,
      this.bullets.enemyCollision
    );
  }

  createPlayer() {
    this.map.findObject("Player", (obj) => {
      if (this._NEWGAME && this._LEVEL === 1) {
        if (obj.type === "StartingPosition") {
          this.player = new Player(this, obj.x * 10, obj.y * 10);
        }
      } else {
        if (obj.type === "StartingPositionPortal") {
          this.player = new Player(this, obj.x, obj.y);
        }
      }
    });
  }

  createPortal() {
    this.map.findObject("Portal", (obj) => {
      if (this._LEVEL === 1) {
        this.portal = new Portal(this, obj.x, obj.y - 68);
      } else if (this._LEVEL === 2) {
        this.portal = new Portal(this, obj.x, obj.y + 70);
      }
    });
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    let width = gameSize.width;
    let height = gameSize.height;
    if (width === undefined) {
      width = this.sys.game.config.width;
    }
    if (height === undefined) {
      height = this.sys.game.config.height;
    }
    this.cameras.resize(width, height);
  }

  createMap() {
    // add water background
    this.add.tileSprite(0, 0, 100, 0, "SetV1", 31);
    // // create the tilemap
    this.map = this.make.tilemap({ key: this._LEVELS[this._LEVEL] });
    // // add tileset image
    this.tiles = this.map.addTilesetImage("SetV1");

    // // create our layers
    this.backgroundLayer = this.map.createLayer("bg", this.tiles, 0, 0);
    this.backgroundLayer.setScale(this.scale);

    this.variationLayer = this.map.createLayer("bg2", this.tiles, 0, 0);
    this.variationLayer.setScale(this.scale);

    this.decorLayer = this.map.createLayer("decor2", this.tiles, 0, 0);
    this.decorLayer.setScale(this.scale);
    this.decorLayer.setCollisionByExclusion([-1]);

    this.blockedLayer = this.map.createLayer("blocked", this.tiles, 0, 0);
    this.blockedLayer.setScale(this.scale);
    this.blockedLayer.setCollisionByExclusion([-1]);
  }

  handleTileCollision(player, tile) {
    if (tile && tile.layer && tile.layer.tilemapLayer && tile.index != 0) {
      const oldTileI = tile.index;
      tile.tilemapLayer.putTileAt(-1, tile.x, tile.y);

      setTimeout(tile.layer.tilemapLayer.putTileAt(555, tile.x, tile.y), 1000);
    }
  }

  // handleSwordHitboxEnemyCollision(enemy) {
  //   if (enemy) {
  //     enemy.destroy;
  //   }
  // }

  drawTops() {
    this.topLayer = this.map.createLayer("Tops", this.tiles, 0, 0);
    this.topLayer.setScale(this.scale);
    this.topLayer.setCollisionByExclusion([-1]);

    this.topLayer.forEachTile((tile) => {
      if (tile.index != 0 && tile.index != -1) {
        tile.faceTop = false;
        tile.faceLeft = false;
        tile.faceRight = false;
      }
    });
  }

  drawBottoms() {
    this.bottomLayer = this.map.createLayer("bottoms", this.tiles, 0, 0);
    this.bottomLayer.setScale(this.scale);
    this.bottomLayer.setCollisionByExclusion([-1]);

    this.bottomLayer.forEachTile((tile) => {
      if (tile.index != 0 && tile.index != -1) {
        tile.faceTop = true;
        tile.faceLeft = false;
        tile.faceRight = false;
        tile.faceBottom = false;
      }
    });
  }

  loadNextLevel(endGame) {
    if (!this.loadingLevel) {
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on("camerafadeoutcomplete", () => {
        if (endGame) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: true });
        } else if (this._LEVEL === 1) {
          this.scene.restart({
            level: 2,
            levels: this._LEVELS,
            newGame: false,
          });
        } else if (this._LEVEL === 2) {
          this.scene.restart({
            level: 1,
            levels: this._LEVELS,
            newGame: false,
          });
        }
      });
      this.loadingLevel = true;
    }
  }
}
