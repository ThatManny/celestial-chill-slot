import { CelestialChillGame } from './game.js';

window.addEventListener("DOMContentLoaded", () => {
  PIXI.Loader.shared
    .add("W1", "assets/wild_pheonix.png")
    .add("S1", "assets/scatter_wings.png")
    .add("F1", "assets/golden_feather.png")
    .add("L1", "assets/feathergreen.png")
    .add("L2", "assets/featherred.png")
    .add("L3", "assets/featherpurple.png")
    .add("L4", "assets/featherblue.png")
    .load((loader, resources) => {
      const game = new CelestialChillGame();
      game.init();                     // now canvas is guaranteed to exist
      game.onAssetsLoaded(resources); // optional if defined
    });
});
