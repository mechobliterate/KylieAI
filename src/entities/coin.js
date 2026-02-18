class Coin {
  constructor(x, y) {
    this.taken = false;
    this.pos = createVector(x, y);
    this.diameter = tileSize / 2.0;
  }

  show() {
    if (!showedCoin && !this.taken) {
      stroke(0);
      fill(255, 182, 193);
      ellipse(this.pos.x, this.pos.y, this.diameter);
      showedCoin = true;
    }
  }

  collides(ptl, pbr) {
    if (this.taken) {
      return false;
    }

    var topLeft = createVector(
      this.pos.x - this.diameter / 2,
      this.pos.y - this.diameter / 2,
    );
    var bottomRight = createVector(
      this.pos.x + this.diameter / 2,
      this.pos.y + this.diameter / 2,
    );
    if (
      ptl.x < bottomRight.x &&
      pbr.x > topLeft.x &&
      ptl.y < bottomRight.y &&
      pbr.y > topLeft.y
    ) {
      this.taken = true;
      return;
    }
    return;
  }
}
