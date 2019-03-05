/* global PIXI */

const Bullet = require('./Bullet').default;

export default class Maya extends PIXI.Sprite {
  constructor({
    game,
    layer = 1,
    bin = 'player',
    x = 0,
    y = 0,
    anchorX = 0.5,
    anchorY = 0.5,
    rotation = 0,
    texture,
    shootSound,
    deathSound,
    speed = 5,
    rotSpeed = 0.05,
    currSpeedups = 0,
    maxSpeedups = 5,
    currUpgrades = 0,
    maxUpgrades = 5,
    bulletSpawnRate = 24,
    bulletSpeed = 10,
    canRotate = true,
    canMove = true,
    deltaSinceLastShot = 0,
  }) {
    super(texture);

    this.game = game;
    this.layer = layer;
    this.bin = bin;

    this.x = x;
    this.y = y;
    this.anchor.set(anchorX, anchorY);
    this.rotation = rotation;

    this.shootSound = shootSound;
    this.deathSound = deathSound;
    this.speed = speed;
    this.rotSpeed = rotSpeed;
    this.currHealth = 1;
    this.maxHealth = 1;
    this.currSpeedups = currSpeedups;
    this.maxSpeedups = maxSpeedups;
    this.currUpgrades = currUpgrades;
    this.maxUpgrades = maxUpgrades;
    this.bulletSpawnRate = bulletSpawnRate;
    this.bulletSpeed = bulletSpeed;
    this.canRotate = canRotate;
    this.canMove = canMove;
    this.deltaSinceLastShot = deltaSinceLastShot;

    this.addSpeedup = this.addSpeedup.bind(this);
    this.addUpgrade = this.addUpgrade.bind(this);
    this.takeDamage = this.takeDamage.bind(this);
  }

  addSpeedup(amount) {
    this.currSpeedups = Math.min(this.currSpeedups + amount, this.maxSpeedups);
  }

  addUpgrade(amount) {
    this.currUpgrades = Math.min(this.currUpgrades + amount, this.maxUpgrades);
  }

  takeDamage(amount) {
    this.currHealth -= amount;
  }

  update(delta) {
    const { spawnSprite, gameOver, resources } = this.game;
    const { screen } = this.game.app;
    const { isKeyDown, Keys } = this.game.controls;

    this.deltaSinceLastShot += delta;

    // death
    if (this.currHealth < 1) {
      this.deathSound.play();
      gameOver();
      return;
    }

    // forward movement
    let speedCalc = 0;

    if (this.canMove && isKeyDown(Keys.UP)) speedCalc += this.speed;
    if (this.canMove && isKeyDown(Keys.DOWN)) speedCalc -= this.speed;
    if (isKeyDown(Keys.SLOW)) speedCalc *= 0.5;

    this.x -= speedCalc * delta * Math.cos(this.rotation);
    this.y -= speedCalc * delta * Math.sin(this.rotation);

    // rotation movement
    let rotationCalc = 0;

    if (this.canRotate && isKeyDown(Keys.LEFT)) rotationCalc -= this.rotSpeed;
    if (this.canRotate && isKeyDown(Keys.RIGHT)) rotationCalc += this.rotSpeed;
    if (isKeyDown(Keys.SLOW)) rotationCalc *= 0.5;

    this.rotation += rotationCalc * delta;

    // OOB checks
    if (this.x < 0) this.x = 0;
    else if (this.x > screen.width) this.x = screen.width;

    if (this.y < 0) this.y = 0;
    else if (this.y > screen.height) this.y = screen.height;

    // shoot
    const shouldShoot = isKeyDown(Keys.SHOOT)
      && this.deltaSinceLastShot > this.bulletSpawnRate - this.bulletSpawnRate * 0.15 * this.currSpeedups;

    if (shouldShoot) {
      this.deltaSinceLastShot = 0;

      let shot1Texture = null;

      if (this.currUpgrades > 4) shot1Texture = 'bullet3';
      else if (this.currUpgrades > 3) shot1Texture = 'bullet2';
      else shot1Texture = 'bullet1';

      spawnSprite(new Bullet({
        game: this.game,
        x: this.x,
        y: this.y,
        rotation: this.rotation,
        texture: resources[shot1Texture].texture,
        sound: resources.shoot.sound,
        hitCount: this.currUpgrades > 4 ? 99 : 1,
      }));

      if (this.currUpgrades > 0) {
        spawnSprite(new Bullet({
          game: this.game,
          x: this.x,
          y: this.y,
          rotation: this.rotation + Math.PI / 6,
          texture: resources[this.currUpgrades > 3 ? 'bullet2' : 'bullet1'].texture,
          sound: resources.shoot.sound,
          hitCount: 1,
        }));

        spawnSprite(new Bullet({
          game: this.game,
          x: this.x,
          y: this.y,
          rotation: this.rotation - Math.PI / 6,
          texture: resources[this.currUpgrades > 3 ? 'bullet2' : 'bullet1'].texture,
          sound: resources.shoot.sound,
          hitCount: 1,
        }));
      }

      if (this.currUpgrades > 1) {
        spawnSprite(new Bullet({
          game: this.game,
          x: this.x,
          y: this.y,
          texture: resources[this.currUpgrades > 3 ? 'bullet2' : 'bullet1'].texture,
          rotation: this.rotation + Math.PI / 4,
          sound: resources.shoot.sound,
          hitCount: 1,
        }));

        spawnSprite(new Bullet({
          game: this.game,
          x: this.x,
          y: this.y,
          texture: resources[this.currUpgrades > 3 ? 'bullet2' : 'bullet1'].texture,
          rotation: this.rotation - Math.PI / 4,
          sound: resources.shoot.sound,
          hitCount: 1,
        }));
      }

      if (this.currUpgrades > 2) {
        spawnSprite(new Bullet({
          game: this.game,
          x: this.x,
          y: this.y,
          texture: resources[this.currUpgrades > 3 ? 'bullet2' : 'bullet1'].texture,
          rotation: this.rotation + Math.PI,
          sound: resources.shoot.sound,
          hitCount: 1,
        }));
      }

      this.shootSound.play();
    }
  }
}
