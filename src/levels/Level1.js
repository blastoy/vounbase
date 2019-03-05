const { random } = require('lodash');

const Parallax = require('../sprites/Parallax').default;
const Jelai = require('../sprites/Jelai').default;

export default class Level1 {
  constructor({ game }) {
    this.game = game;

    this.lastJelai = 0;
    this.jelaiSpawnRate = 300;

    const { spawnSprite, maya, resources } = this.game;
    const { screen } = this.game.app;

    spawnSprite(new Parallax({
      game: this.game,
      y: -resources.earth.texture.height + screen.height,
      texture: resources.earth.texture,
      target: maya,
    }));

    spawnSprite(new Parallax({
      game: this.game,
      y: -resources.clouds.texture.height + screen.height,
      texture: resources.clouds.texture,
      speed: 0.5,
    }));
  }

  update(delta) {
    const { maya, resources, spawnSprite } = this.game;
    const { screen } = this.game.app;

    this.lastJelai += delta;

    if (this.lastJelai > this.jelaiSpawnRate) {
      this.lastJelai = 0;
      this.jelaiSpawnRate *= 0.99;

      let x = 0;
      let y = 0;

      switch (random(0, 3)) {
      case 0:
        x = 0;
        y = random(0, screen.height);
        break;
      case 1:
        x = screen.width;
        y = random(0, screen.height);
        break;
      case 2:
        x = random(0, screen.width);
        y = 0;
        break;
      case 3:
        x = random(0, screen.width);
        y = screen.height;
        break;
      default:
        break;
      }

      spawnSprite(new Jelai({
        game: this.game,
        x,
        y,
        texture: resources.jelai.texture,
        sound: resources.dead.sound,
        target: maya
      }));
    }
  }
}