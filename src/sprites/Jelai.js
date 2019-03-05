/* global PIXI */

const { random } = require('lodash');

const Buff = require('./Buff').default;
const HealthBar = require('./HealthBar').default;

export default class Jelai extends PIXI.Sprite {
  constructor({
    game,
    layer = 3,
    bin = 'enemy',
    x = 0,
    y = 0,
    rotation = 0,
    anchorX = 0.5,
    anchorY = 0.5,
    texture,
    sound,
    speed = 0.5,
    currHealth = 2,
    maxHealth = 2,
    score = 13,
    chase = true,
    target,
  }) {
    super(texture);

    this.game = game;
    this.layer = layer;
    this.bin = bin;

    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.anchor.set(anchorX, anchorY);

    this.texture = texture;
    this.sound = sound;
    this.speed = speed;
    this.currHealth = currHealth;
    this.maxHealth = maxHealth;
    this.score = score;
    this.chase = chase;
    this.target = target;
  }

  update(delta) {
    const { resources, bin, maya, spawnSprite, destroySprite } = this.game;
    const { addScore } = this.game.score;

    if (!this.chase || !this.target || this.target._destroyed) return true;

    const tan = Math.atan2(
      this.target.y - this.y,
      this.target.x - this.x
    );

    this.rotation = tan + Math.PI;
    this.x -= this.speed * delta * Math.cos(this.rotation);
    this.y -= this.speed * delta * Math.sin(this.rotation);

    if (PIXI.bump.hit(this, maya)) {
      maya.takeDamage(1);
    }

    for (let bullet of bin.bullet || []) {
      if (!PIXI.bump.hit(this, bullet)) continue;

      bullet.hitCount -= 1;
      this.currHealth -= 1;

      if (!this.healthBar) {
        const healthBar = new HealthBar({
          game: this.game,
          texture: resources.health.texture,
          target: this,
        });

        this.healthBar = healthBar;
        spawnSprite(healthBar);
      }

      if (this.currHealth > 0) continue;

      switch (random(1, 100)) {
      case 1:
        spawnSprite(new Buff({
          game: this.game,
          x: this.x,
          y: this.y,
          texture: resources.speedup.texture,
          sound: resources.item.sound,
          action: 'addSpeedup',
          target: maya,
        }));
        break;

      case 2:
        spawnSprite(new Buff({
          game: this.game,
          x: this.x,
          y: this.y,
          texture: resources.upgrade.texture,
          sound: resources.item.sound,
          action: 'addUpgrade',
          target: maya,
        }));
        break;

      default:
        break;
      }

      addScore(this.score);
      destroySprite(this);
      this.sound.play();
      break;
    }
  }
}
