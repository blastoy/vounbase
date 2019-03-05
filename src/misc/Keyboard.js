const { includes } = require('lodash');

export default class KeyboardInput {
  constructor(elem) {
    this.Keys = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SHOOT: 32,
      SLOW: 16,
    };

    this.keyCodesDown = [];

    this.isKeyDown = this.isKeyDown.bind(this);

    elem.onkeydown = this._onKeyDown.bind(this);
    elem.onkeyup = this._onKeyUp.bind(this);
  }

  isKeyDown(key) {
    return includes(this.keyCodesDown, key);
  }

  _onKeyDown(evt) {
    if (includes(this.keyCodesDown, evt.keyCode)) return; // safety check
    this.keyCodesDown.push(evt.keyCode);
  }

  _onKeyUp(evt) {
    if (!includes(this.keyCodesDown, evt.keyCode)) return; // safety check
    this.keyCodesDown.splice(this.keyCodesDown.indexOf(evt.keyCode), 1);
  }
}
