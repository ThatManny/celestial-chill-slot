import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/+esm';



export class CelestialChillGame {
  constructor() {
    this.app = null;
    this.score = 0;
    this.reels = [];
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

    this.freeSpinsLabel = new PIXI.Text("", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x66ccff,
      fontWeight: "bold"
    });
    this.freeSpinsLabel.anchor.set(0.5);
    if (!this.app || !this.app.screen) {
  console.error("PIXI Application or screen is not ready.");
  return;
}
this.freeSpinsLabel.x = this.app.screen.width / 2;

    this.freeSpinsLabel.y = 80;
    this.app.stage.addChild(this.freeSpinsLabel);

    this.scoreLabel = new PIXI.Text("Coins: 0", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffcc00,
      fontWeight: "bold"
    });
    this.scoreLabel.anchor.set(0.5);
    this.scoreLabel.x = this.app.screen.width / 2;
    this.scoreLabel.y = 110;
    this.app.stage.addChild(this.scoreLabel);

    this.winMessage = new PIXI.Text("", {
      fontFamily: "Arial",
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
        const symbol = createSymbolSprite(symbolName);
        symbol.y = j * symbolSize;
        reel.addChild(symbol);
      }
    }

    const spinButton = new PIXI.Text("SPIN", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: 0xffffff,
      fontWeight: "bold"
    });
    spinButton.anchor.set(0.5);
    spinButton.x = this.app.screen.width / 2;
    spinButton.y = 650;
    spinButton.interactive = true;
    spinButton.buttonMode = true;
    spinButton.on("pointerdown", () => this.spinReels());
    this.app.stage.addChild(spinButton);
  }



    onAssetsLoaded(resources) {
    this.symbolTextures = {
      W1: resources["assets/wild_pheonix.png"].texture,
      S1: resources["assets/scatter_wings.png"].texture,
      F1: resources["assets/golden_feather.png"].texture,
      L1: resources["assets/feathergreen.png"].texture,
      L2: resources["assets/featherred.png"].texture,
      L3: resources["assets/featherpurple.png"].texture,
      L4: resources["assets/featherblue.png"].texture,
    };
      
spinReels() {
 
  if (this.spinning) return;
  this.spinning = true;

 
  const promises = this.reels.map((reel, i) => {
    return new Promise(resolve => {
      gsap.to(reel, {
        y: reel.y + 600,               
        duration: 0.6 + i * 0.1,        
        ease: "power4.out",
        onComplete: () => {
          
          reel.y = 0;

         
          reel.removeChildren();
          for (let j = 0; j < 7; j++) {
            const name = getRandomSymbol();
            const s = createSymbolSprite.call(this, name);
            s.y = j * 100;
            reel.addChild(s);
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

  }

function createSymbolSprite(name) {
 
  const tex = this.symbolTextures?.[name] ?? null;

  const sprite = tex
    ? new PIXI.Sprite(tex)
    : (() => {
        const g = new PIXI.Graphics();
        g.beginFill(colorMap[name] || 0x999999);
        g.drawRoundedRect(0,0,100,100,12);
        g.endFill();
        return g;
      })();

  sprite.width = 100;
  sprite.height = 100;
  return sprite;
}


function getRandomSymbol() {
  const symbolPool = ["L1", "L2", "L3", "L4", "F1", "W1", "S1"];
  return symbolPool[Math.floor(Math.random() * symbolPool.length)];
}
checkWins() {
 
  const middleRowSymbols = this.reels.map(r => {
    
    return r.getChildAt(2).texture ?? r.getChildAt(2).text;
  });
  const allSame = middleRowSymbols.every(s => s === middleRowSymbols[0]);
  if (allSame) {
    this.score += 100;
    this.winMessage.text = "You win 100!";
  } else {
    this.winMessage.text = "";
  }
  this.scoreLabel.text = `Coins: ${this.score}`;
}
