import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/+esm';

export class CelestialChillGame {
  constructor() {
    this.app = null;
    this.score = 0;
    this.reels = [];
    this.symbolTextures = {};
    this.spinning = false;
  }

  init() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error("Canvas not found. Make sure it exists in the HTML before calling init().");
      return;
    }

    this.app = new PIXI.Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x0a1a2f,
      view: canvas
    });

    
    this.freeSpinsLabel = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x66ccff,
      fontWeight: 'bold'
    });
    this.freeSpinsLabel.anchor.set(0.5);
    this.freeSpinsLabel.x = this.app.screen.width / 2;
    this.freeSpinsLabel.y = 80;
    this.app.stage.addChild(this.freeSpinsLabel);

    this.scoreLabel = new PIXI.Text('Coins: 0', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffcc00,
      fontWeight: 'bold'
    });
    this.scoreLabel.anchor.set(0.5);
    this.scoreLabel.x = this.app.screen.width / 2;
    this.scoreLabel.y = 110;
    this.app.stage.addChild(this.scoreLabel);

    this.winMessage = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: 0xffff66,
      stroke: 0x000000,
      strokeThickness: 4
    });
    this.winMessage.anchor.set(0.5);
    this.winMessage.x = this.app.screen.width / 2;
    this.winMessage.y = 40;
    this.app.stage.addChild(this.winMessage);

   
    const reelCount = 6;
    const symbolsPerReel = 7;
    const symbolSize = 100;
    const reelSpacing = 120;
    const offsetX = 100;
    const offsetY = 100;

    for (let i = 0; i < reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = offsetX + i * reelSpacing;
      reel.y = offsetY;
      this.app.stage.addChild(reel);
      this.reels.push(reel);

      for (let j = 0; j < symbolsPerReel; j++) {
        const symbolName = getRandomSymbol();
        const symbol = createSymbolSprite.call(this, symbolName);
        symbol.y = j * symbolSize;
        reel.addChild(symbol);
      }
    }

    
    const spinButton = new PIXI.Text('SPIN', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    spinButton.anchor.set(0.5);
    spinButton.x = this.app.screen.width / 2;
    spinButton.y = 650;
    spinButton.interactive = true;
    spinButton.buttonMode = true;
    spinButton.on('pointerdown', () => this.spinReels());
    this.app.stage.addChild(spinButton);
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
