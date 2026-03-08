import { LEVEL_DURATION_SECONDS } from '../config/levels.js';
import { Enemy } from '../entities/Enemy.js';
import { Player } from '../entities/Player.js';
import { evaluateLevelOneOutcome, shouldKeepLingerAnimation } from '../systems/rules.js';

const LINGER_MS = 3500;
const LEVEL_TRANSITION_DELAY_MS = 1800;

export class Game {
  constructor({ canvas, input, levelConfig, musicManager, hud, levelDurationSeconds = LEVEL_DURATION_SECONDS }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.levelConfig = levelConfig;
    this.musicManager = musicManager;
    this.hud = hud;
    this.levelDurationSeconds = levelDurationSeconds;

    this.player = new Player({
      x: 80,
      y: 380,
      color: levelConfig.hero.color,
      speed: levelConfig.hero.speed,
      name: levelConfig.hero.name
    });

    this.enemies = [
      new Enemy({ x: 380, y: 390, type: levelConfig.enemyTypes[0] }),
      new Enemy({ x: 590, y: 360, type: levelConfig.enemyTypes[1] }),
      new Enemy({ x: 800, y: 390, type: levelConfig.enemyTypes[2] })
    ];

    this.defeatedEnemies = 0;
    this.levelStartMs = performance.now();
    this.lastFrameMs = performance.now();
    this.message = 'Move: left/right arrows. Jump: up arrow. Use action keys near enemies.';
    this.linger = null;
    this.over = false;
    this.transitionAtMs = null;
  }

  start() {
    const unlockAudio = () => this.musicManager.start();

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    requestAnimationFrame((time) => this.frame(time));
  }

  frame(nowMs) {
    const dt = (nowMs - this.lastFrameMs) / 1000;
    this.lastFrameMs = nowMs;

    if (!this.over) {
      this.update(dt, nowMs);
    } else {
      this.handleTransitions(nowMs);
    }

    this.draw(nowMs);
    requestAnimationFrame((time) => this.frame(time));
  }

  update(dt, nowMs) {
    this.player.update(this.input, dt, this.canvas.width);

    const actionPressed = this.input.isPressed(this.levelConfig.controls.actionPrimary) ||
      this.input.isPressed(this.levelConfig.controls.actionSecondary) ||
      this.input.isPressed('KeyM') ||
      this.input.isPressed('KeyX');

    if (actionPressed) {
      for (const enemy of this.enemies) {
        if (enemy.isActive && enemy.intersects(this.player)) {
          enemy.isActive = false;
          this.defeatedEnemies += 1;
          this.message = `${enemy.type} defeated! Great job!`;
          this.linger = { startedMs: nowMs, text: this.message, type: 'success' };
          console.info('[combat] enemy defeated', {
            enemyType: enemy.type,
            defeatedEnemies: this.defeatedEnemies,
            atMs: nowMs
          });
        }
      }
    }

    const elapsed = (nowMs - this.levelStartMs) / 1000;
    const remaining = Math.max(0, Math.ceil(this.levelDurationSeconds - elapsed));

    if (this.levelConfig.id === 1 && evaluateLevelOneOutcome(this.defeatedEnemies)) {
      this.over = true;
      this.message = 'Victory! Level 2 loading...';
      this.linger = { startedMs: nowMs, text: this.message, type: 'victory' };
      this.transitionAtMs = nowMs + LEVEL_TRANSITION_DELAY_MS;
    }

    if (remaining === 0 && !this.over) {
      this.over = true;

      if (this.levelConfig.id === 1) {
        this.message = 'Time ended. Loading Level 2 for the next challenge...';
        this.transitionAtMs = nowMs + LEVEL_TRANSITION_DELAY_MS;
      } else {
        this.message = 'Time ended. Press R to restart level 2.';
      }

      this.linger = { startedMs: nowMs, text: this.message, type: 'loss' };
    }

    if (this.input.isPressed('KeyR') && this.over && this.levelConfig.id !== 1) {
      location.reload();
    }

    this.renderHud(remaining);
  }

  handleTransitions(nowMs) {
    if (this.levelConfig.id === 1 && this.transitionAtMs && nowMs >= this.transitionAtMs) {
      const params = new URLSearchParams(window.location.search);
      params.set('level', '2');
      window.location.search = params.toString();
    }
  }

  renderHud(remaining) {
    this.hud.levelName.textContent = `Level: ${this.levelConfig.name}`;
    this.hud.timer.textContent = `Time left: ${remaining}s / ${this.levelDurationSeconds}s`;
    this.hud.objective.textContent = `Objective: ${this.levelConfig.objective}`;
    this.hud.status.textContent = `Defeated: ${this.defeatedEnemies}/3 | ${this.message}`;
  }

  draw(nowMs) {
    const { sky, ground, accent } = this.levelConfig.palette;

    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = ground;
    this.ctx.fillRect(0, 430, this.canvas.width, 110);

    this.ctx.fillStyle = accent;
    this.ctx.font = '20px sans-serif';
    this.ctx.fillText('⚑ Danger signs near cactus fields', 25, 60);

    this.drawParallax(nowMs);
    this.player.draw(this.ctx);
    this.enemies.forEach((enemy) => enemy.draw(this.ctx));

    if (this.linger && shouldKeepLingerAnimation(this.linger.startedMs, nowMs, LINGER_MS)) {
      this.ctx.fillStyle = this.linger.type === 'loss' ? '#3f0b0b' : '#113f1f';
      this.ctx.fillRect(180, 180, 620, 120);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '28px sans-serif';
      this.ctx.fillText(this.linger.text, 200, 250, 580);
    }
  }

  drawParallax(nowMs) {
    const offset = (nowMs / 50) % this.canvas.width;
    this.ctx.fillStyle = 'rgba(255,255,255,0.22)';

    for (let i = -1; i < 5; i += 1) {
      const x = i * 260 - offset * 0.1;
      this.ctx.fillRect(x, 300, 90, 130);
      this.ctx.fillRect(x + 30, 260, 30, 40);
    }
  }
}
