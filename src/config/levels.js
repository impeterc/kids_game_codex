export const LEVEL_DURATION_SECONDS = 180;

/**
 * We keep level configuration data-only so kids/parents can edit content safely
 * without touching rendering or game loop logic.
 */
export const levels = {
  1: {
    id: 1,
    name: "Clara's Pink Rainbow Watch",
    palette: {
      sky: '#ffb0df',
      ground: '#ff80c8',
      accent: '#ffe7f7'
    },
    hero: {
      name: 'Sally the Unicorn',
      color: '#ffffff',
      speed: 85
    },
    controls: {
      actionPrimary: 'KeyW',
      actionSecondary: 'KeyE'
    },
    enemyTypes: ['Cactus', 'Snake', 'Bad Unicorn'],
    objective: 'Defeat 3 bad guys to trigger rainbow + balloon shower.'
  },
  2: {
    id: 2,
    name: "Willy's Cartoon Spooky Wasteland",
    palette: {
      sky: '#57402a',
      ground: '#89633e',
      accent: '#7f49cc'
    },
    hero: {
      name: 'Thunder Thrower',
      color: '#ffcf70',
      speed: 95
    },
    controls: {
      cannon: 'KeyM',
      speed: 'KeyF',
      strength: 'KeyX',
      flight: 'KeyG'
    },
    enemyTypes: ['Snake', 'Purple Demon', 'Fanged Armadillo', 'Weird Rat'],
    objective: 'Collect 25 treasures while avoiding 10 danger mistakes in a row.'
  }
};
