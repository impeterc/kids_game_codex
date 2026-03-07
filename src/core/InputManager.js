export class InputManager {
  constructor() {
    this.keys = new Set();
  }

  attach() {
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });
  }

  isPressed(code) {
    return this.keys.has(code);
  }
}
