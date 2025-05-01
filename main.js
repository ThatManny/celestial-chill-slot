console.log("▶️ main.js loaded");

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/+esm';
import { CelestialChillGame } from './game.js';

window.addEventListener("DOMContentLoaded", async () => {
  console.log("▶️ DOMContentLoaded");

  
  const assetList = [
    "assets/wild_pheonix.png",
    "assets/scatter_wings.png",
    "assets/golden_feather.png",
    "assets/feathergreen.png",
    "assets/featherred.png",
    "assets/featherpurple.png",
    "assets/featherblue.png"
  ];

 
  console.log("⏳ Loading assets…");
  let resources;
  try {
    resources = await PIXI.Assets.load(assetList);
    console.log("✅ Assets loaded:", Object.keys(resources));
  } catch (err) {
    console.error("❌ Asset load failed:", err);
    return;
  }


  const game = new CelestialChillGame();
  console.log("▶️ Instantiated game");
  game.onAssetsLoaded(resources);
  console.log("▶️ onAssetsLoaded called");
  game.init();
  console.log("▶️ init() called");
});
