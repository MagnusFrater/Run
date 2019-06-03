function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHex() {
  const options = '1234567890abcdef';
  let s = '0x';

  for (let i=0; i<6; i++) {
    s += options.charAt(getRandomInt(0, options.length - 1));
  }

  return s;
}

function collideRectRect(r1, r2) {
  return !(
    r1.top() > r2.bottom() ||
    r1.bottom() < r2.top() ||
    r1.left() > r2.right() ||
    r1.right() < r1.left()
  );
}

class Rectangle {
  top() {
    return this.rectangle.y;
  }

  bottom() {
    return this.rectangle.y + this.rectangle.height;
  }

  left() {
    return this.rectangle.x;
  }

  right() {
    return this.rectangle.x + this.rectangle.width;
  }
}

const fiveSecondsInMillis = 5 * 1000 / 50;
const ballSize = 25;
const ballVelocity = 2.0;
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
    this.rectangle.x = x;
    this.rectangle.y = y;
    this.xDir = (getRandomInt(0, 1) === 0)? -1 : 1;
    this.yDir = 1;

    gameScene.addChild(this.rectangle);
  }

  update(delta) {
    let xDelta = ballVelocity + delta;
    let yDelta = ballVelocity + delta;

    while (xDelta > 0 && yDelta > 0) {
      // move one step horizontally
      this.rectangle.x += 1 * this.xDir;

      // collision w/ left or right walls
      if (this.left() < 0 || this.right() > app.screen.width) {
        this.xDir *= -1;
      }

      // move one step vertically
      this.rectangle.y += 1 * this.yDir;

      // collision w/ ceiling or floor
      if (this.top() < 0 || this.bottom() > app.screen.height) {
        this.yDir *= -1;
      }

      // collision w/ floor
      if (collideRectRect(this, floor)) {
        this.yDir *= -1;
      }

      xDelta--;
      yDelta--;
    }
  }
}

function spawnBall() {
  balls.push(new Ball(balls.length, getRandomInt(0, screenWidth - ballSize), 0, ballSize, ballSize));
  lastBallSpawn = Date.now();
  ballCountUI.text = balls.length;
}

let floor;

class Platform extends Rectangle {
  constructor(x, y, width, height, hex) {
    super();

    this.rectangle = new PIXI.Graphics();

    this.rectangle.lineStyle(1, 0x000000, 1, 0);

    this.rectangle.beginFill(hex);
    this.rectangle.drawRect(0, 0, width, height);
    this.rectangle.endFill();

    this.rectangle.x = x;
    this.rectangle.y = y;

    gameScene.addChild(this.rectangle);
  }
}

const screenWidth = 1080;
const screenRatio = 16 / 9;
let app;

let state;
let gameScene = new PIXI.Container();
let gameOverlayScene = new PIXI.Container();
let gameOverScene = new PIXI.Container();

function setup() {
  // create Pixi.js application
  app = new PIXI.Application({
    width: screenWidth,
    height: screenWidth / screenRatio,
    backgroundColor: 0xffffff
  });
  document.getElementsByTagName('main')[0].appendChild(app.view);

  // add scenes
  app.stage.addChild(gameScene);
  app.stage.addChild(gameOverlayScene);
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  // add ball count UI
  ballCountUI = new PIXI.Text('0');
  gameOverlayScene.addChild(ballCountUI);

  // create platform
  floor = new Platform(0, app.screen.height - 32, app.screen.width, 32, 0x555555);

  // spawn first ball
  spawnBall();

  // set the game state to `play`
  state = play;

  // start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  // update each individual ball
  balls.forEach(ball => {
    ball.update(delta);
  });

  // spawn new ball every 5 seconds
  if (Date.now() - lastBallSpawn >= fiveSecondsInMillis) {
    spawnBall();
  }
}

function end() {
  clearInterval(ballSpawner);
}

setup();
