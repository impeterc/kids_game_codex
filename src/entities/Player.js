export class Player {
  constructor({ x, y, color, speed, name }) {
    this.x = x;
    this.y = y;
    this.width = 72;
    this.height = 92;
    this.color = color;
    this.speed = speed;
    this.name = name;

    this.groundY = y;
    this.verticalVelocity = 0;
    this.gravity = 900;
    this.jumpVelocity = 420;
  }

  update(input, dt, worldWidth) {
    const distance = this.speed * dt;
    const onGround = this.y >= this.groundY;

    if (input.isPressed('ArrowRight')) this.x += distance;
    if (input.isPressed('ArrowLeft')) this.x -= distance;

    if (input.isPressed('ArrowUp') && onGround) {
      this.verticalVelocity = -this.jumpVelocity;
    }

    this.verticalVelocity += this.gravity * dt;
    this.y += this.verticalVelocity * dt;

    if (this.y > this.groundY) {
      this.y = this.groundY;
      this.verticalVelocity = 0;
    }

    this.x = Math.max(0, Math.min(worldWidth - this.width, this.x));
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Long neck hint for Sally and broad shoulders hint for Thunder Thrower.
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(this.x + this.width * 0.25, this.y - 24, this.width * 0.5, 24);
  }
}
