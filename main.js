console.log("▶️ main.js loaded");

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/+esm';
import { CelestialChillGame } from './game.js';

window.addEventListener("DOMContentLoaded", () => {
  console.log("▶️ DOMContentLoaded");
  const game = new CelestialChillGame();
  game.init();
});
