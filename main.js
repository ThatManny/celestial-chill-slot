import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/+esm';
import { CelestialChillGame } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const game = new CelestialChillGame();

  PIXI.Loader.shared
    .add('W1', 'assets/wild_pheonix.png')
    .add('S1', 'assets/scatter_wings.png')
    .add('F1', 'assets/golden_feather.png')
    .add('L1', 'assets/feathergreen.png')
    .add('L2', 'assets/featherred.png')
    .add('L3', 'assets/featherpurple.png')
    .add('L4', 'assets/featherblue.png')
    .load((loader, resources) => {
      game.onAssetsLoaded(resources);
      game.init();
    });
});
