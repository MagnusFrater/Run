let app;
const textures = {};

window.addEventListener("load", function () {
  // create Pixi.js application
  app = new PIXI.Application({
    width: screenWidth,
    height: screenWidth / screenRatio,
    backgroundColor: 0xffffff,
  });
  document.getElementsByTagName("main")[0].appendChild(app.view);

  app.loader.add("kazoo", "static/img/kazoo.png").load((loader, resources) => {
    textures.kazoo = resources.kazoo.texture;

    setup();
  });
});

const screenWidth = 1080;
const screenRatio = 16 / 9;

let state;
let titleScene = new PIXI.Container();
let gameScene = new PIXI.Container();
let gameOverlayScene = new PIXI.Container();
let gameOverScene = new PIXI.Container();

let gameOverMessage;

function setup() {
  // add key listeners
  document.addEventListener("keydown", (event) => {
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

  document.addEventListener("keyup", (event) => {
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
  app.stage.addChild(titleScene);
  app.stage.addChild(gameScene);
  app.stage.addChild(gameOverlayScene);
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  // set up title scene
  const titleUI = new PIXI.Text("RUN");
  titleScene.addChild(titleUI);

  // set up game over scene
  const blackScreen = new PIXI.Graphics();
  blackScreen.beginFill(0x000000);
  blackScreen.drawRect(0, 0, app.screen.width, app.screen.height);
  blackScreen.endFill();
  blackScreen.position.set(0, 0);
  gameOverScene.addChild(blackScreen);

  gameOverMessage = new PIXI.Text("Game Over", { fill: 0xffffff });
  gameOverScene.addChild(gameOverMessage);

  // add ball count UI
  ballCountUI = new PIXI.Text("0");
  gameOverlayScene.addChild(ballCountUI);

  // create platform
  floor = new Platform(
    0,
    app.screen.height - 32,
    app.screen.width,
    32,
    0x555555
  );

  // create player
  player = new Player(app.screen.width / 2, app.screen.height / 2);

  // spawn first ball
  spawnBall();

  // set the game state to `play`
  state = title;

  // start the game loop
  app.ticker.add((delta) => gameLoop(delta));
}

function title() {
  titleScene.visible = true;
  gameScene.visible = false;
  gameOverlayScene.visible = false;
  gameOverScene.visible = false;

  setTimeout(() => {
    titleScene.visible = false;
    gameScene.visible = true;
    gameOverlayScene.visible = true;

    state = play;
  }, 2000);
}

function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  // update each individual ball
  balls.forEach((ball) => {
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
