export class CelestialChillGame {
  constructor() {
    this.app = null;
    this.score = 0;
    this.reels = [];
  }

  init() {
    this.app = new PIXI.Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x0a1a2f,
      view: document.getElementById('game-canvas')
    });

    this.freeSpinsLabel = new PIXI.Text("", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x66ccff,
      fontWeight: "bold"
    });
    this.freeSpinsLabel.anchor.set(0.5);
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
    game.init();
    game.onAssetsLoaded(resources);
  });

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


  checkPayouts() {
    const numRows = 7;
    const minMatch = 3;
    let scatterCount = 0;
    let foundWin = false;

    for (let row = 0; row < numRows; row++) {
      let currentSymbol = null;
      let matchCount = 0;

      for (let col = 0; col < this.symbolGrid.length; col++) {
        const cell = this.symbolGrid[col][row];
        const symbol = cell.name;

        if (symbol === "S1") scatterCount++;

        if (symbol === currentSymbol) {
          matchCount++;
        } else {
          if (matchCount >= minMatch) {
            this.handleWin(currentSymbol, matchCount, row, col - matchCount);
            foundWin = true;
          }
          currentSymbol = symbol;
          matchCount = 1;
        }
      }

      if (matchCount >= minMatch) {
        this.handleWin(currentSymbol, matchCount, row, this.symbolGrid.length - matchCount);
        foundWin = true;
      }
    }

    if (scatterCount >= 3) {
      if (this.isFreeSpins) {
        this.freeSpinsRemaining += 5;
        this.freeSpinsLabel.text = `Free Spins Left: ${this.freeSpinsRemaining}`;
        this.winMessage.text = `Retriggered! +5 Free Spins! (${scatterCount} Scatters)`;
      } else {
        this.winMessage.text = `Bonus Triggered! ${scatterCount} Scatters!`;
        this.startFreeSpins();
        return;
      }
      foundWin = true;
    }

    if (!foundWin) this.winMessage.text = "No win. Try again!";

    gsap.to(this.winMessage, {
      alpha: 0,
      delay: 2.5,
      duration: 1,
      onStart: () => {
        this.winMessage.alpha = 1;
      }
    });
  }

  handleWin(symbol, count, row, startCol) {
    const multiplier = this.isFreeSpins ? this.bonusMultiplier : 1;
    const baseReward = count * 10;
    const reward = baseReward * multiplier;

    this.score += reward;
    this.scoreLabel.text = `Coins: ${this.score}`;
    this.winMessage.text = `Win! ${count}x ${symbol} on row ${row + 1} (x${multiplier}) = +${reward} coins`;

    for (let i = startCol; i < startCol + count; i++) {
      const matchSprite = this.symbolGrid[i][row].sprite;
      matchSprite.tint = 0xffff00;
    }
  }

  startFreeSpins() {
    this.isFreeSpins = true;
    this.freeSpinsRemaining = 5;
    this.bonusMultiplier = 2;

    this.app.renderer.backgroundColor = 0x111133;
    this.winMessage.text = "🎉 Free Spins Started!";
    this.winMessage.alpha = 1;
    this.freeSpinsLabel.text = `Free Spins Left: ${this.freeSpinsRemaining}`;
    this.freeSpinsLabel.alpha = 1;
    this.autoSpinNext();
  }

  autoSpinNext() {
    if (this.freeSpinsRemaining > 0) {
      this.freeSpinsRemaining--;
      this.freeSpinsLabel.text = `Free Spins Left: ${this.freeSpinsRemaining}`;
      this.freeSpinsLabel.alpha = 1;
      this.spinReels();
      setTimeout(() => this.autoSpinNext(), 2000);
    } else {
      this.isFreeSpins = false;
      this.app.renderer.backgroundColor = 0x0a1a2f;
      this.winMessage.text = "Free Spins Complete!";
      this.freeSpinsLabel.text = "";
    }
  }

  onAssetsLoaded(resources) {
    const wild = new PIXI.Sprite.from("assets/wild_pheonix.png");
    wild.anchor.set(0.5);
    wild.x = this.app.screen.width / 2 - 300;
    wild.y = this.app.screen.height / 2;
    wild.scale.set(0.6);
    this.app.stage.addChild(wild);

    gsap.to(wild.scale, {
      x: 0.65,
      y: 0.65,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    gsap.to(wild, {
      y: wild.y - 10,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    gsap.to(wild, {
      alpha: 0.9,
      duration: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });

    const scatter = new PIXI.Sprite.from("assets/scatter_wings.png");
    scatter.anchor.set(0.5);
    scatter.x = this.app.screen.width / 2 + 300;
    scatter.y = this.app.screen.height / 2;
    scatter.scale.set(0.6);
    this.app.stage.addChild(scatter);

    const blur = new PIXI.filters.BlurFilter();
    blur.blur = 0;
    scatter.filters = [blur];

    gsap.to(blur, {
      blur: 3,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    const glow = new PIXI.filters.GlowFilter({
      distance: 15,
      outerStrength: 2,
      innerStrength: 0,
      color: 0x00ccff,
      quality: 0.5
    });
    scatter.filters.push(glow);

    gsap.to(scatter.scale, {
      x: -0.6,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
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
