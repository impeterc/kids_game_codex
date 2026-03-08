/**
 * Pure rules module: easy to unit test, used by Game class, no browser dependencies.
 */
export function evaluateLevelOneOutcome(defeatedEnemies) {
  return defeatedEnemies >= 3;
}

export function evaluateLevelTwoOutcome(collectedTreasures, consecutiveMistakes) {
  if (consecutiveMistakes >= 10) {
    return { status: 'lose', reason: 'Too many dangers in a row.' };
  }

  if (collectedTreasures >= 25) {
    return { status: 'win', reason: 'All treasures recovered!' };
  }

  return { status: 'continue', reason: 'Keep exploring.' };
}

export function shouldKeepLingerAnimation(startTime, nowTime, lingerMs) {
  return nowTime - startTime < lingerMs;
}
