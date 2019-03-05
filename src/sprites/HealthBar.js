/* global PIXI */

export default class HealthBar extends PIXI.Sprite {
  constructor({
    game,
    layer = 4,
    bin = 'status',
    x = 0,
    y = 0,
    anchorX = 0.5,
    anchorY = 0.5,
    rotation = 0,
    texture,
    target,
  }) {
    super(texture);

    this.game = game;
    this.layer = layer;
    this.bin = bin;

    this.x = x;
    this.y = y;
    this.anchor.set(anchorX, anchorY);
    this.rotation = rotation;

    this.target = target;
  }

  update() {
    const { destroySprite } = this.game;

    if (!this.target || this.target._destroyed) {
      destroySprite(this);
      return;
    }

    this.x = this.target.x;
    this.y = this.target.y - this.target.height + 10;
    this.scale.x = this.target.currHealth / this.target.maxHealth;
  }
}