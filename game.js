
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

    this.loadAssets();
  }


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
