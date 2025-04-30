
export class CelestialChillGame {
  constructor() {
    this.app = null;
  }

  init() {
  
  
  this.app = new PIXI.Application({
    width: 1280,
    height: 720,
    backgroundColor: 0x0a1a2f,
    view: document.getElementById('game-canvas')
  });

    
spinReels() {
  const symbolSize = 100;
  const spinDuration = 0.5;

  this.symbolGrid = []; // 2D array: [reel][row]

  for (let i = 0; i < this.reels.length; i++) {
    const reel = this.reels[i];

    gsap.to(reel, {
      y: reel.y + 50,
      duration: spinDuration,
      ease: "power1.in",
      onComplete: () => {
        reel.y -= 50;
        reel.removeChildren();

        const column = [];

        for (let j = 0; j < 7; j++) {
          const symbolName = getRandomSymbol();
          const symbol = createSymbolSprite(symbolName);
          symbol.y = j * symbolSize;
          reel.addChild(symbol);
          column.push(symbolName); // Track symbol ID
        }

        this.symbolGrid[i] = column;

        // When all reels have spun, check wins
        if (i === this.reels.length - 1) {
          setTimeout(() => this.checkPayouts(), 300); // small delay for visual sync
        }
      },
      delay: i * 0.1

      checkPayouts() {
  const numRows = 7;       // number of visible rows
  const minMatch = 3;      // how many symbols needed to win

  for (let row = 0; row < numRows; row++) {
    let currentSymbol = null;
    let matchCount = 0;

    for (let col = 0; col < this.symbolGrid.length; col++) {
      const symbol = this.symbolGrid[col][row];

      if (symbol === currentSymbol) {
        matchCount++;
      } else {
        // check for a completed match streak
        if (matchCount >= minMatch) {
          console.log(`Win! ${matchCount}x ${currentSymbol} on row ${row + 1}`);
        }
        currentSymbol = symbol;
        matchCount = 1;
      }
    }

    // Final check at end of row
    if (matchCount >= minMatch) {
      console.log(`Win! ${matchCount}x ${currentSymbol} on row ${row + 1}`);
    }
  }
}



  this.reels = [];

  // Continue with reel creation, spin button, etc.

    this.reels = []; // Store all reel containers
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

  // Fill the reel with random placeholder symbols
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

    });

    this.loadAssets();
  }
PIXI.Loader.shared
  .add("W1", "assets/wild_phoenix.png")
  .add("S1", "assets/scatter_wings.png")
  .add("F1", "assets/golden_feather.png")
  .add("L1", "assets/feathergreen.png")
  .add("L2", "assets/featherred.png")
  .add("L3", "assets/featherpurple.png")
  .add("L4", "assets/featherblue.png")
  .load(() => this.init());


onAssetsLoaded(resources) {
  // Load the static phoenix image
  const wild = new PIXI.Sprite.from("assets/wild_pheonix.png");
  wild.anchor.set(0.5);
  wild.x = this.app.screen.width / 2;
  wild.y = this.app.screen.height / 2;
  wild.scale.set(0.6);
  this.app.stage.addChild(wild);

  // Add pulsing glow
  gsap.to(wild.scale, {
    x: 0.65,
    y: 0.65,
    duration: 0.8,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  // Add floating motion
  gsap.to(wild, {
    y: wild.y - 10,
    duration: 1.2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  // Optional: flicker alpha (like flame pulse)
  gsap.to(wild, {
    alpha: 0.9,
    duration: 0.3,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
  });
}
// Load the scatter wings image

// === SCATTER WINGS EFFECTS ===
const scatter = new PIXI.Sprite.from("assets/scatter_wings.png");
scatter.anchor.set(0.5);
scatter.x = this.app.screen.width / 2 + 300; // adjust position as needed
scatter.y = this.app.screen.height / 2;
scatter.scale.set(0.6);
this.app.stage.addChild(scatter);

// Add blur filter
const blur = new PIXI.filters.BlurFilter();
blur.blur = 0;
scatter.filters = [blur];

// Animate blur focus/pulse
gsap.to(blur, {
  blur: 3,
  duration: 1.5,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut"
});

// Add glow filter (requires pixi-filters-glow.min.js)
const glow = new PIXI.filters.GlowFilter({
  distance: 15,
  outerStrength: 2,
  innerStrength: 0,
  color: 0x00ccff,
  quality: 0.5
});
scatter.filters.push(glow);

// Flip horizontally back and forth
gsap.to(scatter.scale, {
  x: -0.6, // flips the image
  duration: 2,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut"
});
function createSymbolSprite(name) {
  const container = new PIXI.Container();

  // Choose a color based on symbol type
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
