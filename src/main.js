/* global PIXI Bump */

const Game = require('./misc/Game').default;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.bump = new Bump(PIXI);

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x000,
});

document.body.appendChild(app.view);

PIXI.loader
  .add('shoot', './res/shoot.wav')
  .add('pew', './res/pew.wav')
  .add('dead', './res/dead.wav')
  .add('item', './res/item.wav')
  .add('bullet1', './res/bullet1.png')
  .add('bullet2', './res/bullet2.png')
  .add('bullet3', './res/bullet3.png')
  .add('zap', './res/zap.png')
  .add('jelai', './res/jelai.png')
  .add('helai', './res/helai.png')
  .add('maya', './res/maya.png')
  .add('speedup', './res/speedup.png')
  .add('upgrade', './res/upgrade.png')
  .add('earth', './res/earth.png')
  .add('clouds', './res/clouds.png')
  .add('health', './res/health.png')
  .add('pmeter', './res/pmeter.png')
  .once('complete', onResourcesLoad)
  .load();

function onResourcesLoad(loader, resources) {
  new Game(document, app, resources);
}