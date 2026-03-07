export class Player {
  constructor({ x, y, color, speed, name }) {
    this.x = x;
    this.y = y;
    this.width = 72;
    this.height = 92;
    this.color = color;
    this.speed = speed;
    this.name = name;
  }

  update(input, dt, worldWidth) {
    const distance = this.speed * dt;

    if (input.isPressed('ArrowRight')) this.x += distance;
    if (input.isPressed('ArrowLeft')) this.x -= distance;
    if (input.isPressed('ArrowUp')) this.y -= distance;
    if (input.isPressed('ArrowDown')) this.y += distance;

    this.x = Math.max(0, Math.min(worldWidth - this.width, this.x));
    this.y = Math.max(200, Math.min(430, this.y));
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Long neck hint for Sally and broad shoulders hint for Thunder Thrower.
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(this.x + this.width * 0.25, this.y - 24, this.width * 0.5, 24);
  }
}
