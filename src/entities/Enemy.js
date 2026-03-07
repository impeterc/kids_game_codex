export class Enemy {
  constructor({ x, y, type }) {
    this.x = x;
    this.y = y;
    this.width = 56;
    this.height = 56;
    this.type = type;
    this.isActive = true;
  }

  draw(ctx) {
    if (!this.isActive) return;

    ctx.fillStyle = '#4b1f1f';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#fff2f2';
    ctx.font = '12px sans-serif';
    ctx.fillText(this.type, this.x - 2, this.y - 8);
  }

  intersects(target) {
    return (
      this.x < target.x + target.width &&
      this.x + this.width > target.x &&
      this.y < target.y + target.height &&
      this.y + this.height > target.y
    );
  }
}
