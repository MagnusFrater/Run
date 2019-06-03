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
    r2.left() > r1.right() || 
    r2.right() < r1.left() || 
    r2.top() > r1.bottom() ||
    r2.bottom() < r1.top()
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
    this.xDir = (getRandomInt(0, 1) === 0)? -1 : 1;
    this.yDir = 1;

    gameScene.addChild(this.rectangle);
  }

  update(delta) {
    let xDelta = ballVelocity + delta;
    let yDelta = ballVelocity + delta;

    // move horizontally
    for (let i=0; i<xDelta; i++) {
      // move one step
      this.rectangle.x += 1 * this.xDir;

      // collision w/ left or right walls
      if (this.left() < 0 || this.right() > app.screen.width) {
        this.xDir *= -1;
      }
    }

    // move vertically
    for (let i=0; i<yDelta; i++) {
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

    this.rectangle.position.set(x, y);

    gameScene.addChild(this.rectangle);
  }
}

let player;

class Player extends Rectangle {
  constructor(x, y) {
    super();
    
    this.rectangle = new PIXI.Sprite(PIXI.loader.resources["static/images/kazoo.png"].texture);
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
      for (let i=0; i<xDelta; i++) {
        // collision w/ left wall
        if (this.left() > 0) {
          this.rectangle.x += -1;
        }
      }
    }

    // moving right
    if (this.moveRight && !this.moveLeft  && !this.groundPounding) {
      for (let i=0; i<xDelta; i++) {
        // collision w/ right wall
        if (this.right() < app.screen.width) {
          this.rectangle.x += 1;
        }
      }
    }

    // going down
    if (!this.grounded) {
      if (yDelta > 0) {
        for (let i=0; i<Math.abs(yDelta); i++) {
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
      } else { // going up
        for (let i=0; i<Math.abs(yDelta); i++) {
          // collision w/ ceiling
          if (this.top() < 0) {
            this.yVelocity = 0;
          } else {
            this.rectangle.y += -1;
          }
        }
      }
    }

    for (let i=0; i<balls.length; i++) {
      if (collideRectRect(this, balls[i])) {
        console.log(this);
        console.log(balls[i]);
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
      if (this.yVelocity < 10) this.yVelocity = 10;
      this.groundPounding = true;
    }
  }
}

const screenWidth = 1080;
const screenRatio = 16 / 9;
let app;

let state;
let gameScene = new PIXI.Container();
let gameOverlayScene = new PIXI.Container();
let gameOverScene = new PIXI.Container();

let gameOverMessage;

function setup() {
  console.log("All files loaded");

  // create Pixi.js application
  app = new PIXI.Application({
    width: screenWidth,
    height: screenWidth / screenRatio,
    backgroundColor: 0xffffff
  });
  document.getElementsByTagName('main')[0].appendChild(app.view);

  // add key listeners
  document.addEventListener('keydown', event => {
    // player move left
    if (event.keyCode === 37 || event.keyCode === 65) {
        player.moveLeft = true;
    }

    // player move right
    if (event.keyCode === 39 || event.keyCode === 68) {
      player.moveRight = true;
    }

    // player jump
    if (event.keyCode === 32 || event.keyCode === 38) {
      player.jump();
    }

    // player groundpound
    if (event.keyCode === 40 || event.keyCode === 83) {
      player.groundPound();
    }
  });

  document.addEventListener('keyup', event => {
    // player move left
    if (event.keyCode === 37 || event.keyCode === 65) {
        player.moveLeft = false;
    }

    // player move right
    if (event.keyCode === 39 || event.keyCode === 68) {
      player.moveRight = false;
    }
  });

  // add scenes
  app.stage.addChild(gameScene);
  app.stage.addChild(gameOverlayScene);
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  // set up game over screen
  const blackScreen = new PIXI.Graphics();
  blackScreen.beginFill(0x000000);
  blackScreen.drawRect(0, 0, app.screen.width, app.screen.height);
  blackScreen.endFill();
  blackScreen.position.set(0, 0);
  gameOverScene.addChild(blackScreen);

  gameOverMessage = new PIXI.Text('Game Over', {fill: 0xffffff});
  gameOverScene.addChild(gameOverMessage);

  // add ball count UI
  ballCountUI = new PIXI.Text('0');
  gameOverlayScene.addChild(ballCountUI);

  // create platform
  floor = new Platform(0, app.screen.height - 32, app.screen.width, 32, 0x555555);

  // create player
  player = new Player(app.screen.width / 2, app.screen.height / 2);

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

  player.update(delta);
}

function end() {
  gameScene.visible = false;
  gameOverlayScene.visible = false;
  gameOverScene.visible = true;
}

PIXI.Loader.shared
  .add([
    'static/images/kazoo.png',
  ])
  .on('progress', (loader, resource) => {
    console.log("progress: " + loader.progress + "%");
  })
  .load(setup);
