import { describe, expect, it } from 'vitest';
import { Player } from '../../src/entities/Player.js';

function makeInput(pressed = []) {
  const set = new Set(pressed);
  return {
    isPressed(code) {
      return set.has(code);
    }
  };
}

describe('player movement', () => {
  it('moves left and right but not down with arrow keys', () => {
    const player = new Player({ x: 100, y: 380, color: '#fff', speed: 100, name: 'Test' });

    player.update(makeInput(['ArrowRight']), 1, 1000);
    expect(player.x).toBe(200);

    const yBefore = player.y;
    player.update(makeInput(['ArrowDown']), 1, 1000);
    expect(player.y).toBe(yBefore);
  });

  it('jumps with ArrowUp and lands back on the ground', () => {
    const player = new Player({ x: 100, y: 380, color: '#fff', speed: 100, name: 'Test' });

    player.update(makeInput(['ArrowUp']), 0.1, 1000);
    expect(player.y).toBeLessThan(380);

    for (let i = 0; i < 30; i += 1) {
      player.update(makeInput([]), 0.1, 1000);
    }

    expect(player.y).toBe(380);
  });
});
