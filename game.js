
export class CelestialChillGame {
  constructor() {
    this.app = null;
    this.score = 0;

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
  fill: 0xffcc00, // gold-like color
  fontWeight: "bold"
});
this.scoreLabel.anchor.set(0.5);
this.scoreLabel.x = this.app.screen.width / 2;
this.scoreLabel.y = 110;
this.app.stage.addChild(this.scoreLabel);

    
spinReels() {
  for (const reel of this.reels) {
    for (const child of reel.children) {
      child.tint = 0xFFFFFF;
    }
  }

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
const sprite = createSymbolSprite(symbolName);
sprite.y = j * symbolSize;
reel.addChild(sprite);

// ✅ Store both name and sprite
column.push({ name: symbolName, sprite: sprite });


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
let scatterCount = 0;

  for (let row = 0; row < numRows; row++) {
    let currentSymbol = null;
    let matchCount = 0;

    for (let col = 0; col < this.symbolGrid.length; col++) {
     const cell = this.symbolGrid[col][row];
const symbol = cell.name;
if (symbol === "S1") {
  scatterCount++;
}


      if (symbol === currentSymbol) {
        matchCount++;
      } else {
        // check for a completed match streak

if (matchCount >= minMatch) {
 let payoutMultiplier = this.isFreeSpins ? this.bonusMultiplier : 1;
let baseReward = matchCount * 10; // e.g., 10 coins per symbol matched
let reward = baseReward * payoutMultiplier;
this.score += reward;
this.scoreLabel.text = `Coins: ${this.score}`;

  this.winMessage.text = `Win! ${matchCount}x ${currentSymbol} on row ${row + 1} (x${payoutMultiplier}) = +${reward} coins`;


  // Highlight the matching sprites
  for (let k = col - matchCount; k < col; k++) {
    const matchedSprite = this.symbolGrid[k][row].sprite;
    matchedSprite.tint = 0xffff00; // Yellow tint for highlight
  }
}


        currentSymbol = symbol;
        matchCount = 1;
      }
    }

    // Final check at end of row
  if (matchCount >= minMatch) {
 let payoutMultiplier = this.isFreeSpins ? this.bonusMultiplier : 1;
this.winMessage.text = `Win! ${matchCount}x ${currentSymbol} on row ${row + 1} (x${payoutMultiplier})`;


if (scatterCount >= 3) {
  if (this.isFreeSpins) {
    this.freeSpinsRemaining += 5;
    this.freeSpinsLabel.text = `Free Spins Left: ${this.freeSpinsRemaining}`;

    
   this.winMessage.text = `Retriggered! +5 Free Spins! (${scatterCount} Scatters)`;
  } else {
    this.winMessage.text = `Bonus Triggered! ${scatterCount} Scatters!`;
    this.startFreeSpins();
  }
}



  // Optional: call a bonus method like this.startFreeSpins();
}

  // Highlight those symbols
  for (let k = this.symbolGrid.length - matchCount; k < this.symbolGrid.length; k++) {
    const matchedSprite = this.symbolGrid[k][row].sprite;
    matchedSprite.tint = 0xffff00;
  }
}

if (!this.winMessage.text) {
  this.winMessage.text = "No win. Try again!";
}
gsap.to(this.winMessage, {
  alpha: 0,
  delay: 2.5,
  duration: 1,
  onStart: () => {
    this.winMessage.alpha = 1;
  }
});

startFreeSpins() {
  this.bonusMultiplier = 2; // 2x payouts during free spins

  this.isFreeSpins = true;
  this.freeSpinsRemaining = 5;

  // Optional: Visual cue (e.g., change background color)
  this.app.renderer.backgroundColor = 0x111133;

  this.winMessage.text = "🎉 Free Spins Started!";
  this.winMessage.alpha = 1;

  this.autoSpinNext();
}
autoSpinNext() {
  if (this.freeSpinsRemaining > 0) {
    this.freeSpinsRemaining--;
    this.freeSpinsLabel.text = `Free Spins Left: ${this.freeSpinsRemaining}`;
this.freeSpinsLabel.alpha = 1;

    this.spinReels();

    // Schedule next spin after delay
    setTimeout(() => this.autoSpinNext(), 2000);
  } else {
    // End Free Spins
    this.isFreeSpins = false;
    this.app.renderer.backgroundColor = 0x0a1a2f; // reset background
    this.winMessage.text = "Free Spins Complete!";
    this.winMessage.alpha = 1;
    this.freeSpinsLabel.text = "";

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
this.winMessage = new PIXI.Text("", {
  fontFamily: "Arial",
  fontSize: 32,
  fill: 0xffff66,
  stroke: 0x000000,
  strokeThickness: 4
});
this.winMessage.anchor.set(0.5);
this.winMessage.x = this.app.screen.width / 2;
this.winMessage.y = 40; // Top of screen
this.app.stage.addChild(this.winMessage);

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
