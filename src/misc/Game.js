/* global PIXI */

const Keyboard = require('./Keyboard').default;

const Maya = require('../sprites/Maya').default;
const Score = require('../sprites/Score').default;

const Level1 = require('../levels/Level1').default;

export default class Game {
  constructor(elem, app, resources) {
    this.elem = elem;
    this.app = app;
    this.resources = resources;
    this.controls = new Keyboard(elem);

    this.layers = [];
    this.bin = {};
    this.binKeys = Object.keys(this.bin);

    this.spawnSprite = this.spawnSprite.bind(this);
    this.destroySprite = this.destroySprite.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this._tick = this._tick.bind(this);

    this.maya = new Maya({
      game: this,
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2,
      rotation: Math.PI / 2,
      texture: this.resources.maya.texture,
      shootSound: this.resources.shoot.sound,
      deathSound: this.resources.gameover.sound,
    });

    this.spawnSprite(this.maya);

    this.score = new Score({
      x: this.app.screen.width - 10,
      y: 10,
      score: 0,
    });

    this.spawnSprite(this.score);

    this.currentLevel = new Level1({
      game: this
    });

    this.app.ticker.add(this._tick);
  }

  spawnSprite(sprite) {
    while (sprite.layer > this.layers.length - 1) {
      const container = new PIXI.Container();
      this.layers.push(container);
      this.app.stage.addChild(container);
    }

    if (!this.bin[sprite.bin]) {
      this.bin[sprite.bin] = [];
      this.binKeys = Object.keys(this.bin);
    }

    this.bin[sprite.bin].push(sprite);
    this.layers[sprite.layer].addChild(sprite);
  }

  destroySprite(sprite) {
    if (sprite.layer > this.layers.length - 1) {
      throw 'Tried to destroy a sprite on a layer that does not exist!';
    }

    if (!this.bin[sprite.bin]) {
      throw 'Tried to destroy a sprite from a bin that does not exist!';
    }

    this.bin[sprite.bin].splice(this.bin[sprite.bin].indexOf(sprite), 1);
    this.layers[sprite.layer].removeChild(sprite);

    sprite.destroy();
    sprite = null;
  }

  gameOver() {
    this.app.ticker.remove(this._tick);
  }

  _tick(delta) {
    if (this.currentLevel) {
      this.currentLevel.update(delta);
    }

    for (let key of this.binKeys) {
      for (let sprite of this.bin[key]) {
        sprite.update(delta);
      }
    }
  }
}