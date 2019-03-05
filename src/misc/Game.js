/* global PIXI */

const Keyboard = require('./Keyboard').default;

const Maya = require('../sprites/Maya').default;
const Parallax = require('../sprites/Parallax').default;
const Jelai = require('../sprites/Jelai').default;

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

    this.maya = new Maya({
      game: this,
      x: app.screen.width / 2,
      y: app.screen.height / 2,
      rotation: Math.PI / 2,
      texture: resources.maya.texture,
      sound: resources.shoot.sound,
    });

    this.spawnSprite(this.maya);

    this.spawnSprite(new Parallax({
      game: this,
      y: -this.resources.earth.texture.height + this.app.screen.height,
      texture: this.resources.earth.texture,
      target: this.maya,
    }));

    this.spawnSprite(new Parallax({
      game: this,
      y: -resources.clouds.texture.height + app.screen.height,
      texture: resources.clouds.texture,
      speed: 0.5,
    }));

    this.spawnSprite(new Jelai({
      game: this,
      texture: resources.jelai.texture,
      sound: resources.dead.sound,
      target: this.maya
    }));

    this.app.ticker.add(this._tick.bind(this));
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

  _tick(delta) {
    for (let key of this.binKeys) {
      for (let sprite of this.bin[key]) {
        sprite.update(delta);
      }
    }
  }
}