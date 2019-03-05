/* global PIXI */

const { parseInt } = require('lodash');

export default class Score extends PIXI.Text {
  constructor({
    game,
    layer = 5,
    bin = 'gui',
    x = 0,
    y = 0,
    anchorX = 1,
    anchorY = 0,
    rotation = 0,
    score = 0,
    fontFamily = 'Arial',
    fontSize = 24,
    fill = 0xffffff,
    strokeThickness = 1,
    align = 'right',
  }) {
    super(score, {
      fontFamily,
      fontSize,
      fill,
      strokeThickness,
      align
    });

    this.game = game;
    this.layer = layer;
    this.bin = bin;

    this.x = x;
    this.y = y;
    this.anchor.set(anchorX, anchorY);
    this.rotation = rotation;

    this.addScore = this.addScore.bind(this);
    this.subtractScore = this.subtractScore.bind(this);
  }

  addScore(amount) {
    this.text = parseInt(this.text) + parseInt(amount);
  }

  subtractScore(amount) {
    this.text = parseInt(this.text) - parseInt(amount);
  }

  update() {}
}
