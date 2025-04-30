import { CelestialChillGame } from './game.js';

window.addEventListener("DOMContentLoaded", () => {
  const game = new CelestialChillGame();
  game.init(); // init() handles PIXI.Loader and setup
});
