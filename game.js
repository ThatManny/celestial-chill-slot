console.log("▶️ game.js loaded");

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/+esm';


export class CelestialChillGame {
  constructor() {
    this.app = null;
    this.score = 0;
    this.reels = [];
    this.symbolTextures = {};
    this.spinning = false;
  }

  init() {
  console.log("🚀 init() called");

  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error("Canvas not found!");
    return;
  }

  this.app = new PIXI.Application({ view: canvas });
  console.log("PIXI.Application created:", this.app);

  const g = new PIXI.Graphics();
  g.beginFill(0xff0000);
  g.drawRect(0, 0, 300, 300);
  g.endFill();
  this.app.stage.addChild(g);
  console.log("Drew a red square");
}


  onAssetsLoaded(resources) {
    this.symbolTextures = {
      W1: resources['assets/wild_pheonix.png'].texture,
      S1: resources['assets/scatter_wings.png'].texture,
      F1: resources['assets/golden_feather.png'].texture,
      L1: resources['assets/feathergreen.png'].texture,
      L2: resources['assets/featherred.png'].texture,
      L3: resources['assets/featherpurple.png'].texture,
      L4: resources['assets/featherblue.png'].texture,
    };
  } 

  spinReels() {
    if (this.spinning) return;
    this.spinning = true;

    const promises = this.reels.map((reel, i) => {
      return new Promise(resolve => {
        gsap.to(reel, {
          y: reel.y + 600,
          duration: 0.6 + i * 0.1,
          ease: 'power4.out',
          onComplete: () => {
            reel.y = 0;
            reel.removeChildren();
            for (let j = 0; j < 7; j++) {
              const symbolName = getRandomSymbol();
              const symbol = createSymbolSprite.call(this, symbolName);
              symbol.y = j * 100;
              reel.addChild(symbol);
            }
            resolve();
          }
        });
      });
    });

    Promise.all(promises).then(() => {
      this.spinning = false;
      this.checkWins();
    });
  } 

  checkWins() {
    const middleRow = this.reels.map(reel => {
      const child = reel.getChildAt(2);
      return child.texture ? child.texture : child.text;
    });
    const first = middleRow[0];
    const allSame = middleRow.every(item => item === first);
    if (allSame) {
      this.score += 100;
      this.winMessage.text = 'You win 100!';
    } else {
      this.winMessage.text = '';
    }
    this.scoreLabel.text = `Coins: ${this.score}`;
  } 

} 



function createSymbolSprite(name) {
  const container = new PIXI.Container();
  const tex = this.symbolTextures[name];

  if (tex) {
    const sprite = new PIXI.Sprite(tex);
    sprite.width = 100;
    sprite.height = 100;
    container.addChild(sprite);
  } else {
    const colorMap = {
      L1: 0xff6666, L2: 0xffcc66, L3: 0x99cc66,
      L4: 0x66cccc, W1: 0xff0000, S1: 0xffff00,
      F1: 0x999999
    };
    const g = new PIXI.Graphics();
    g.beginFill(colorMap[name] || 0x999999);
    g.drawRoundedRect(0, 0, 100, 100, 12);
    g.endFill();
    container.addChild(g);

    const label = new PIXI.Text(name, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center'
    });
    label.anchor.set(0.5);
    label.x = 50;
    label.y = 50;
    container.addChild(label);
  }

  return container;
}

function getRandomSymbol() {
  const pool = ['L1', 'L2', 'L3', 'L4', 'F1', 'W1', 'S1'];
  return pool[Math.floor(Math.random() * pool.length)];
}
