import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/+esm';
import { CelestialChillGame } from './game.js';

window.addEventListener("DOMContentLoaded", async () => {
  
  const assetList = [
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
    resources = await PIXI.Assets.load(assetList);
  } catch (err) {
    console.error("Failed to load assets:", err);
    return;
  }

 
  const game = new CelestialChillGame();
  game.onAssetsLoaded(resources);
  game.init();
});
