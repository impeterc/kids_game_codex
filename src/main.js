import { MusicManager } from './audio/MusicManager.js';
import { levels } from './config/levels.js';
import { Game } from './core/Game.js';
import { InputManager } from './core/InputManager.js';

const query = new URLSearchParams(window.location.search);
const selectedLevel = Number(query.get('level') || 1);
const levelConfig = levels[selectedLevel] ?? levels[1];
const requestedDuration = Number(query.get('duration'));
const levelDurationSeconds = Number.isFinite(requestedDuration) && requestedDuration > 0
  ? requestedDuration
  : undefined;

console.info('[boot] game startup', {
  selectedLevel,
  levelName: levelConfig.name,
  levelObjective: levelConfig.objective,
  levelDurationSeconds: levelDurationSeconds ?? 'default'
});

const canvas = document.getElementById('gameCanvas');
const hud = {
  levelName: document.getElementById('levelName'),
  timer: document.getElementById('timer'),
  status: document.getElementById('status'),
  objective: document.getElementById('objective')
};

const input = new InputManager();
input.attach();

const musicManager = new MusicManager();

const game = new Game({
  canvas,
  input,
  levelConfig,
  musicManager,
  hud,
  levelDurationSeconds
});

game.start();
