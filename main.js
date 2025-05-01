import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/+esm';

import { CelestialChillGame } from './game.js';

window.addEventListener("DOMContentLoaded", async () => {
  
  const urls = [
    "assets/wild_pheonix.png",
    "assets/scatter_wings.png",
    "assets/golden_feather.png",
    "assets/feathergreen.png",
    "assets/featherred.png",
    "assets/featherpurple.png",
    "assets/featherblue.png"
  ];

  let resources;
  try {
    resources = await PIXI.Assets.load(urls);
  } catch (err) {
    console.error("Asset load failed:", err);
    return;
  }

  
  const game = new CelestialChillGame();
  game.init();                    // canvas is on the page
  game.onAssetsLoaded(resources); // pass the map if you need it
});
