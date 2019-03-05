/* global PIXI */

export default class Bullet extends PIXI.Sprite {
  constructor({
    game,
    layer = 2,
    bin = 'bullet',
    x = 0,
    y = 0,
    anchor = 0.5,
    rotation = 0,
    texture,
    sound,
    speed = 10,
    damage = 1,
    hitCount = 1,
  }) {
    super(texture);

    this.game = game;
    this.layer = layer;
    this.bin = bin;

    this.x = x;
    this.y = y;
    this.anchor.set(anchor);
    this.rotation = rotation;

    this.sound = sound;
    this.speed = speed;
    this.damage = damage;
    this.hitCount = hitCount;
  }

  update(delta) {
    const { destroySprite } = this.game;
    const { screen } = this.game.app;

    this.x -= this.speed * delta * Math.cos(this.rotation);
    this.y -= this.speed * delta * Math.sin(this.rotation);

    if (
      this.hitCount < 1 ||
      this.x < 0 - this.width / 2 ||
      this.x > screen.width + this.width / 2 ||
      this.y < 0 - this.height / 2 ||
      this.y > screen.height + this.height / 2
    ) {
      destroySprite(this);
    }
  }
}
