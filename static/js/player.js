let player;

class Player extends Rectangle {
  constructor(x, y) {
    super();

    // this.rectangle = new PIXI.Sprite(
    //   PIXI.Loader.resources["static/img/kazoo.png"].texture
    // );
    this.rectangle = new PIXI.Sprite(textures.kazoo);
    this.rectangle.position.set(x, y);
    this.rectangle.scale.set(3, 3);

    this.moveLeft = false;
    this.moveRight = false;

    this.xVelocity = 3.5;
    this.yVelocity = 0;
    this.acceleration = 1;
    this.grounded = false;
    this.jumps = 0;
    this.groundPounding = false;

    gameOverlayScene.addChild(this.rectangle);
  }

  update(delta) {
    let xDelta = this.xVelocity + delta;

    if (!this.grounded) this.yVelocity += this.acceleration;
    let yDelta = this.yVelocity;

    // moving left
    if (this.moveLeft && !this.moveRight && !this.groundPounding) {
      for (let i = 0; i < xDelta; i++) {
        // collision w/ left wall
        if (this.left() > 0) {
          this.rectangle.x += -1;
        }
      }
    }

    // moving right
    if (this.moveRight && !this.moveLeft && !this.groundPounding) {
      for (let i = 0; i < xDelta; i++) {
        // collision w/ right wall
        if (this.right() < app.screen.width) {
          this.rectangle.x += 1;
        }
      }
    }

    // going down
    if (!this.grounded) {
      if (yDelta > 0) {
        for (let i = 0; i < Math.abs(yDelta); i++) {
          // collision w/ floor
          if (collideRectRect(this, floor)) {
            this.grounded = true;
            this.groundPounding = false;
            this.yVelocity = 0;
            this.jumps = 2;
          } else {
            this.rectangle.y += 1;
          }
        }
      } else {
        // going up
        for (let i = 0; i < Math.abs(yDelta); i++) {
          // collision w/ ceiling
          if (this.top() < 0) {
            this.yVelocity = 0;
          } else {
            this.rectangle.y += -1;
          }
        }
      }
    }

    for (let i = 0; i < balls.length; i++) {
      if (collideRectRect(this, balls[i])) {
        state = end;
      }
    }
  }

  jump() {
    if (this.jumps > 0 && !this.groundPounding) {
      this.yVelocity = -20;
      this.grounded = false;
      this.jumps--;
    }
  }

  groundPound() {
    if (!this.grounded && !this.groundPounding) {
      if (this.yVelocity < 15) {
        this.yVelocity = 15;
      } else {
        this.yVelocity += 15;
      }
      this.groundPounding = true;
    }
  }
}
