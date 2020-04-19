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
