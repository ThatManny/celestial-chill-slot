export class CelestialChillGame {
  constructor() {
    this.app            = null;
    this.score          = 0;
    this.reels          = [];
    this.symbolTextures = {};
    this.spinning       = false;
  }

  init() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    this.app = new PIXI.Application({
      width: 1280, height: 720, backgroundColor: 0x000000, view: canvas
    });

    
    this.freeSpinsLabel = new PIXI.Text('', {
      fontFamily:'Arial', fontSize:24, fill:0x66ccff, fontWeight:'bold'
    });
    this.freeSpinsLabel.anchor.set(0.5);
    this.freeSpinsLabel.x = this.app.screen.width/2;
    this.freeSpinsLabel.y =  80;
    this.app.stage.addChild(this.freeSpinsLabel);

    this.scoreLabel = new PIXI.Text('Coins: 0', {
      fontFamily:'Arial', fontSize:24, fill:0xffcc00, fontWeight:'bold'
    });
    this.scoreLabel.anchor.set(0.5);
    this.scoreLabel.x = this.app.screen.width/2;
    this.scoreLabel.y = 110;
    this.app.stage.addChild(this.scoreLabel);

    this.winMessage = new PIXI.Text('', {
      fontFamily:'Arial', fontSize:32,
      fill:0xffff66, stroke:0x000000, strokeThickness:4
    });
    this.winMessage.anchor.set(0.5);
    this.winMessage.x = this.app.screen.width/2;
    this.winMessage.y =  40;
    this.app.stage.addChild(this.winMessage);

   
    const reelCount      = 6;
    const symbolsPerReel = 7;
    const symbolSize     = 100;
    const reelSpacing    = 120;
    const offsetX        = 100;
    const offsetY        = 100;

    for (let i=0; i<reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = offsetX + i*reelSpacing;
      reel.y = offsetY;
      this.app.stage.addChild(reel);
      this.reels.push(reel);

      for (let j=0; j<symbolsPerReel; j++) {
        const name = getRandomSymbol();
        const s    = createSymbolSprite.call(this, name);
        s.y        = j*symbolSize + offsetY;
        reel.addChild(s);
      }
    }

   
    const spinButton = new PIXI.Text('SPIN', {
      fontFamily:'Arial', fontSize:36, fill:0xffffff, fontWeight:'bold'
    });
    spinButton.anchor.set(0.5);
    spinButton.x = this.app.screen.width/2;
    spinButton.y = this.app.screen.height - 200;
    spinButton.eventMode  = 'static';  
    spinButton.buttonMode = true;
    spinButton.on('pointerdown', () => this.spinReels());
    this.app.stage.addChild(spinButton);
  }

  onAssetsLoaded(resources) {
   
    this.symbolTextures = {
      W1: resources.W1.texture,
      S1: resources.S1.texture,
      F1: resources.F1.texture,
      L1: resources.L1.texture,
      L2: resources.L2.texture,
      L3: resources.L3.texture,
      L4: resources.L4.texture,
    };
  }

  spinReels() {
    if (this.spinning) return;
    this.spinning = true;

    const offsetY = 100;

    const promises = this.reels.map((reel, i) =>
      new Promise(resolve => {
        
        reel.filters = [ new PIXI.filters.BlurFilter(4) ];

        gsap.to(reel, {
          y: reel.y + 600,
          duration: 0.6 + i*0.1,
          ease: 'power4.out',
          onComplete: () => {
            reel.filters = [];   
            reel.y = offsetY;
            reel.removeChildren();
            for (let j=0; j<7; j++) {
              const name = getRandomSymbol();
              const s    = createSymbolSprite.call(this, name);
              s.y        = j*100 + offsetY;
              reel.addChild(s);
            }
            resolve();
          }
        });
      })
    );

    Promise.all(promises).then(() => {
      this.spinning = false;
      this.checkWins();
    });
  }

  checkWins() {
    const middle = this.reels.map(r => {
      const c = r.getChildAt(2);
      return c.texture ? c.texture : c.text;
    });
    const first   = middle[0];
    const allSame = middle.every(x => x === first);

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
  const tex = this.symbolTextures[name];
  if (tex) {
    const sprite = new PIXI.Sprite(tex);
    sprite.width  = 100;
    sprite.height = 100;
    sprite.filters = [
      new PIXI.filters.GlowFilter({
        distance:15, outerStrength:2, innerStrength:0,
        color:0xffffff, quality:0.5
      })
    ];
    return sprite;
  }

  const g = new PIXI.Graphics();
  const C = {
    L1:0xff6666, L2:0xffcc66, L3:0x99cc66, L4:0x66cccc,
    W1:0xff0000, S1:0xffff00, F1:0x999999
  };
  g.beginFill(C[name]||0x444444);
  g.drawRoundedRect(0,0,100,100,12);
  g.endFill();
  const label = new PIXI.Text(name, {fontFamily:'Arial',fontSize:24,fill:0x000000});
  label.anchor.set(0.5);
  label.x=50; label.y=50;
  const cont = new PIXI.Container();
  cont.addChild(g,label);
  return cont;
}

function getRandomSymbol() {
  const p=['L1','L2','L3','L4','F1','W1','S1'];
  return p[Math.floor(Math.random()*p.length)];
}
