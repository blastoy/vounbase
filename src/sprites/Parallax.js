/* global PIXI */

export default class Parallax extends PIXI.Sprite {
  constructor({
    game,
    layer = 0,
    bin = 'bg',
    x = 0,
    y = 0,
    anchor = 0,
    rotation = 0,
    texture,
    speed = 1,
    loop = true,
    target,
  }) {
    super(texture);

    this.game = game;
    this.bin = bin;
    this.layer = layer;

    this.x = x;
    this.y = y;
    this.anchor.set(anchor);
    this.rotation = rotation;

    this.speed = speed;
    this.loop = loop;
    this.target = target;
  }

  update(delta) {
    const { screen } = this.game.app;

    this.y += this.speed * delta;

    if (this.loop && this.y > 0) {
      this.y = -this.height + screen.height;
    }

    if (this.target) {
      const padding = this.width - screen.width;
      const ratio = padding / screen.width;

      this.x = ratio * this.target.x;

      // fix sprite calculation inaccuracies
      if (this.x > padding) this.x = padding;
      if (this.x < 0) this.x = 0;

      this.x *= -1;
    }
  }
}
