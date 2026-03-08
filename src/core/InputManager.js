const GAME_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyE',
  'KeyM',
  'KeyF',
  'KeyX',
  'KeyG',
  'KeyR'
]);

export class InputManager {
  constructor() {
    this.keys = new Set();
  }

  attach() {
    window.addEventListener('keydown', (event) => {
      if (GAME_KEYS.has(event.code)) {
        event.preventDefault();
      }

      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
    });
  }

  isPressed(code) {
    return this.keys.has(code);
  }
}
