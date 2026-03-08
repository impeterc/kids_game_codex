export class Treasure {
  constructor({ x, y, label }) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.width = 22;
    this.height = 22;
    this.isCollected = false;
  }

  intersects(target) {
    return (
      this.x < target.x + target.width &&
      this.x + this.width > target.x &&
      this.y < target.y + target.height &&
      this.y + this.height > target.y
    );
  }

  draw(ctx) {
    if (this.isCollected) return;

    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#503900';
    ctx.font = '10px sans-serif';
    ctx.fillText(this.label, this.x - 2, this.y - 5);
  }
}
