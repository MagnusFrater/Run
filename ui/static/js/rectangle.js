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
