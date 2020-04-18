const fiveSecondsInMillis = 5 * 1000;
const ballSize = 32;
const ballVelocity = 3;
let lastBallSpawn;
let balls = [];
let ballCountUI;

class Ball extends Rectangle {
  constructor(id, x, y, width, height) {
    super();

    this.id = id;

    this.rectangle = new PIXI.Graphics();
    this.rectangle.lineStyle(1, 0x000000, 1, 0);
    this.rectangle.beginFill(getRandomHex());
    this.rectangle.drawRect(0, 0, width, height);
    this.rectangle.endFill();
    this.rectangle.position.set(x, y);
    this.xDir = getRandomInt(0, 1) === 0 ? -1 : 1;
    this.yDir = 1;

    gameScene.addChild(this.rectangle);
  }

  update(delta) {
    let xDelta = ballVelocity + delta;
    let yDelta = ballVelocity + delta;

    // move horizontally
    for (let i = 0; i < xDelta; i++) {
      // move one step
      this.rectangle.x += 1 * this.xDir;

      // collision w/ left or right walls
      if (this.left() < 0 || this.right() > app.screen.width) {
        this.xDir *= -1;
      }
    }

    // move vertically
    for (let i = 0; i < yDelta; i++) {
      // move one step
      this.rectangle.y += 1 * this.yDir;

      // collision w/ ceiling
      if (this.top() < 0) {
        this.yDir *= -1;
      }

      // collision w/ floor
      if (collideRectRect(this, floor)) {
        this.yDir *= -1;
      }
    }
  }
}

function spawnBall() {
  balls.push(
    new Ball(
      balls.length,
      getRandomInt(0, screenWidth - ballSize),
      0,
      ballSize,
      ballSize
    )
  );
  lastBallSpawn = Date.now();
  ballCountUI.text = balls.length;
}
