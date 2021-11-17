import * as khroma from 'khroma';
import gsap from 'gsap';
import { Image } from 'p5';
// import gsap from 'gsap';
import _ from 'lodash';
// import { Engine, Runner, Render, Bodies, Vector, Composite, Body } from 'matter-js'
type AnyObject<T = any, K extends string = string> = Record<K, T>;
var { loadSpriteSheet, loadAnimation, createSprite, drawSprites, camera } =
   window;

function drawBg() {
   background(khroma.hsla(220, 40, 10, 1));
}
var centerX = innerWidth / 2;
var centerY = innerHeight / 2;
var proxy = location.host.match('localhost')
   ? '/assets'
   : 'http://localhost:5500';
var sp1 = {
   sprite: {} as Sprite,
   isHold: false,
};

window.preload = () => {
   loadJSON(proxy + '/sprites/BOYFRIEND.json', (json: SpriteFrame[]) => {
      // console.log(json.filter(e => !(/(miss|angry|shaking)/i.test(e.name))).filter(e => /idle(\d+)?/i.test(e.name)))
      var sheet = loadSpriteSheet(
         proxy + '/sprites/BOYFRIEND.png',
         json
            .filter((e) => !/(miss|angry|shaking)/i.test(e.name))
            .filter((e) => /idle(\d+)?/i.test(e.name))
      );
      var idle = loadAnimation(sheet);
      sp1.sprite = createSprite(innerWidth / 2, innerWidth / 2, 100);
      sp1.sprite.scale = 0.3;
      sp1.sprite.shapeColor = color('skyblue');
      sp1.sprite.immovable = true;
      idle.frameDelay = 2;

      var frame: SpriteFrame['frame'],
         img: Image,
         width: number,
         height: number;
      sp1.sprite.draw = function () {
         fill(this.shapeColor.toString());
         // var speed = this.getSpeed()
         frame = idle.getFrameImage().frame;
         img = sheet.image.get(frame.x, frame.y, frame.width, frame.height);
         width = img.width;
         height = img.height;
         img.resize(width * this.scale, height * this.scale);

         push();
         if ((frame as any).r) {
            rotate(radians(-90));
         }
         image(img, 0, 0, width, height);
         pop();

         idle.update();
      };
      // sp1.sprite.maxSpeed = 20
      // sp1.sprite.mouse
   });
};

window.setup = () => {
   createCanvas(innerWidth, innerHeight);
   drawBg();
};

window.mouseDragged = () => {};

window.mouseReleased = () => {
   gsap.to(camera.position, {
      x: centerX,
   });
};

window.windowResized = () => {
   resizeCanvas(innerWidth, innerHeight);
   centerX = innerWidth / 2;
   centerY = innerHeight / 2;
};

window.draw = () => {
   drawBg();

   drawSprites();
};
