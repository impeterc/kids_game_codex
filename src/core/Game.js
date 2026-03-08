import { LEVEL_DURATION_SECONDS } from '../config/levels.js';
import { Enemy } from '../entities/Enemy.js';
import { Player } from '../entities/Player.js';
import { Treasure } from '../entities/Treasure.js';
import {
  evaluateLevelOneOutcome,
  evaluateLevelTwoOutcome,
  shouldKeepLingerAnimation
} from '../systems/rules.js';

const LINGER_MS = 3500;
const DAMAGE_COOLDOWN_MS = 1200;

export class Game {
  constructor({ canvas, input, levelConfig, musicManager, hud }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.levelConfig = levelConfig;
    this.musicManager = musicManager;
    this.hud = hud;

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

    this.treasures = levelConfig.id === 2 ? this.createLevelTwoTreasures() : [];
    this.defeatedEnemies = 0;
    this.collectedTreasures = 0;
    this.consecutiveMistakes = 0;
    this.lastDamageMs = -Infinity;
    this.levelStartMs = performance.now();
    this.lastFrameMs = performance.now();
    this.message = 'Use arrow keys to move. Action keys defeat enemies at close range.';
    this.linger = null;
    this.over = false;
  }

  createLevelTwoTreasures() {
    const labels = ['★', '♥', '$', 'L', 'G'];
    const treasures = [];

    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        treasures.push(
          new Treasure({
            x: 120 + col * 145,
            y: 220 + row * 40,
            label: labels[(row + col) % labels.length]
          })
        );
      }
    }

    return treasures;
  }

  start() {
    window.addEventListener('click', () => this.musicManager.start(), { once: true });
    requestAnimationFrame((time) => this.frame(time));
  }

  frame(nowMs) {
    const dt = (nowMs - this.lastFrameMs) / 1000;
    this.lastFrameMs = nowMs;

    if (this.over) {
      this.handleRestartInput();
    } else {
      this.update(dt, nowMs);
    }

    this.draw(nowMs);
    requestAnimationFrame((time) => this.frame(time));
  }

  handleRestartInput() {
    if (this.input.isPressed('KeyR')) {
      location.reload();
    }
  }

  update(dt, nowMs) {
    this.player.update(this.input, dt, this.canvas.width);

    if (this.levelConfig.id === 2) {
      this.updateLevelTwo(nowMs);
    } else {
      this.updateLevelOne(nowMs);
    }

    const elapsed = (nowMs - this.levelStartMs) / 1000;
    const remaining = Math.max(0, Math.ceil(LEVEL_DURATION_SECONDS - elapsed));

    if (remaining === 0 && !this.over) {
      this.over = true;
      this.message = 'Time ended. Try again! Press R to restart.';
      this.linger = { startedMs: nowMs, text: this.message, type: 'loss' };
    }

    this.renderHud(remaining);
  }

  updateLevelOne(nowMs) {
    const actionPressed = this.input.isPressed(this.levelConfig.controls.actionPrimary) ||
      this.input.isPressed(this.levelConfig.controls.actionSecondary);

    if (actionPressed) {
      for (const enemy of this.enemies) {
        if (!enemy.isActive || !enemy.intersects(this.player)) continue;
        enemy.isActive = false;
        this.defeatedEnemies += 1;
        this.message = `${enemy.type} defeated! Great job!`;
        this.linger = { startedMs: nowMs, text: this.message, type: 'success' };
      }
    }

    if (evaluateLevelOneOutcome(this.defeatedEnemies)) {
      this.over = true;
      this.message = 'Victory! Rainbow + balloon shower unlocked! Press R to restart.';
      this.linger = { startedMs: nowMs, text: this.message, type: 'victory' };
    }
  }

  updateLevelTwo(nowMs) {
    const actionPressed = this.input.isPressed(this.levelConfig.controls.cannon) ||
      this.input.isPressed(this.levelConfig.controls.strength);

    for (const treasure of this.treasures) {
      if (treasure.isCollected || !treasure.intersects(this.player)) continue;
      treasure.isCollected = true;
      this.collectedTreasures += 1;
      this.consecutiveMistakes = 0;
      this.message = `Treasure found! ${this.collectedTreasures}/25`;
      this.linger = { startedMs: nowMs, text: this.message, type: 'success' };
    }

    for (const enemy of this.enemies) {
      if (!enemy.isActive || !enemy.intersects(this.player)) continue;

      if (actionPressed) {
        enemy.isActive = false;
        this.message = `${enemy.type} defeated! Keep collecting treasures.`;
        this.linger = { startedMs: nowMs, text: this.message, type: 'success' };
      } else if (nowMs - this.lastDamageMs > DAMAGE_COOLDOWN_MS) {
        this.lastDamageMs = nowMs;
        this.consecutiveMistakes += 1;
        this.message = `Danger streak ${this.consecutiveMistakes}/10. Press M or X near enemies.`;
        this.linger = { startedMs: nowMs, text: this.message, type: 'loss' };
      }
    }

    const levelTwoOutcome = evaluateLevelTwoOutcome(this.collectedTreasures, this.consecutiveMistakes);

    if (levelTwoOutcome.status === 'win') {
      this.over = true;
      this.message = 'You collected all 25 treasures! Press R to restart.';
      this.linger = { startedMs: nowMs, text: this.message, type: 'victory' };
    }

    if (levelTwoOutcome.status === 'lose') {
      this.over = true;
      this.message = 'Too many danger mistakes in a row. Press R to restart.';
      this.linger = { startedMs: nowMs, text: this.message, type: 'loss' };
    }
  }

  renderHud(remaining) {
    this.hud.levelName.textContent = `Level: ${this.levelConfig.name}`;
    this.hud.timer.textContent = `Time left: ${remaining}s / 180s`;
    this.hud.objective.textContent = `Objective: ${this.levelConfig.objective}`;

    if (this.levelConfig.id === 2) {
      this.hud.status.textContent = `Treasures: ${this.collectedTreasures}/25 | Danger streak: ${this.consecutiveMistakes}/10 | ${this.message}`;
      return;
    }

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
    const signText = this.levelConfig.id === 2
      ? '⚑ Sandstorm warning near old ruins'
      : '⚑ Danger signs near cactus fields';
    this.ctx.fillText(signText, 25, 60);

    this.drawParallax(nowMs);
    this.player.draw(this.ctx);
    this.enemies.forEach((enemy) => enemy.draw(this.ctx));
    this.treasures.forEach((treasure) => treasure.draw(this.ctx));

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
