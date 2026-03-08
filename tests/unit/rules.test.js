import { describe, expect, it } from 'vitest';
import {
  evaluateLevelOneOutcome,
  evaluateLevelTwoOutcome,
  shouldKeepLingerAnimation
} from '../../src/systems/rules.js';

describe('rules', () => {
  it('wins level one when 3 enemies defeated', () => {
    expect(evaluateLevelOneOutcome(3)).toBe(true);
    expect(evaluateLevelOneOutcome(2)).toBe(false);
  });

  it('evaluates level two winning and losing thresholds', () => {
    expect(evaluateLevelTwoOutcome(25, 0)).toEqual({ status: 'win', reason: 'All treasures recovered!' });
    expect(evaluateLevelTwoOutcome(2, 10)).toEqual({ status: 'lose', reason: 'Too many dangers in a row.' });
    expect(evaluateLevelTwoOutcome(4, 2)).toEqual({ status: 'continue', reason: 'Keep exploring.' });
  });

  it('respects 3.5 second linger', () => {
    expect(shouldKeepLingerAnimation(1000, 4200, 3500)).toBe(true);
    expect(shouldKeepLingerAnimation(1000, 4600, 3500)).toBe(false);
  });
});
