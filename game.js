const PIXI = window.PIXI;

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
    // Implementation remains unchanged (populate later as needed)
  }
}

function createSymbolSprite(name) {
  const container = new PIXI.Container();
  const colorMap = {
    L1: 0xff6666,
    L2: 0xffcc66,
    L3: 0x99cc66,
    L4: 0x66cccc,
    L5: 0x6699cc,
    L6: 0xcc66cc,
    H1: 0xffffff,
    W1: 0xff0000,
    S1: 0xffff00
  };

  const graphics = new PIXI.Graphics();
  graphics.beginFill(colorMap[name] || 0x999999);
  graphics.drawRoundedRect(0, 0, 100, 100, 12);
  graphics.endFill();

  const label = new PIXI.Text(name, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x000000,
    align: "center"
  });
  label.anchor.set(0.5);
  label.x = 50;
  label.y = 50;

  container.addChild(graphics);
  container.addChild(label);

  return container;
}

function getRandomSymbol() {
  const symbolPool = ["L1", "L2", "L3", "L4", "F1", "W1", "S1"];
  return symbolPool[Math.floor(Math.random() * symbolPool.length)];
}
