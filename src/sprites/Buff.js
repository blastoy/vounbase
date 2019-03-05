/* global PIXI */

export default class Buff extends PIXI.Sprite {
  constructor({
    game,
    layer = 4,
    bin = 'buff',
    x = 0,
    y = 0,
    anchor = 0.5,
    rotation = 0,
    texture,
    sound,
    action,
    amount = 1,
    currBuffTimeout = 0,
    maxBuffTimeout = 1000,
    currBlinkTimeout = 0,
    maxBlinkTimeout = 2,
    warningTime = 750,
    target,
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
    this.action = action;
    this.amount = amount;
    this.currBuffTimeout = currBuffTimeout;
    this.maxBuffTimeout = maxBuffTimeout;
    this.currBlinkTimeout = currBlinkTimeout;
    this.maxBlinkTimeout = maxBlinkTimeout;
    this.warningTime = warningTime;
    this.target = target;
  }

  update(delta) {
    const { destroySprite } = this.game;

    this.currBuffTimeout += delta;

    if (this.currBuffTimeout > this.maxBuffTimeout) {
      destroySprite(this);
      return;
    }

    // buff about to expire (blinking animation)
    if (this.currBuffTimeout > this.warningTime) {
      this.currBlinkTimeout += delta;

      if (this.currBlinkTimeout > this.maxBlinkTimeout) {
        this.currBlinkTimeout = 0;
        this.alpha = this.alpha < 1 ? 1 : 0.5;
      }
    }

    // buff hit by target
    if (!PIXI.bump.hit(this, this.target)) return;

    this.target[this.action](this.amount);

    destroySprite(this);

    this.sound.play();
  }
}