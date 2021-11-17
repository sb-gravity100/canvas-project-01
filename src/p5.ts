import * as khroma from 'khroma';
import gsap from 'gsap'
import { Image } from 'p5'
// import gsap from 'gsap';
import _ from 'lodash';
// import { Engine, Runner, Render, Bodies, Vector, Composite, Body } from 'matter-js'
type AnyObject<T = any, K extends string = string> = Record<K, T>;
var { loadSpriteSheet, loadAnimation, createSprite, drawSprites } = window

function drawBg() {
   background(khroma.hsla(220, 40, 10, 1))
}

var sp1: ReturnType<typeof createSprite>

window.preload = () => {
   loadJSON('/assets/sprites/BOYFRIEND.json', (json: SpriteFrame[]) => {
      // console.log(json.filter(e => !(/(miss|angry|shaking)/i.test(e.name))).filter(e => /idle(\d+)?/i.test(e.name)))
      var sheet = loadSpriteSheet('/assets/sprites/BOYFRIEND.png', json.filter(e => !(/(miss|angry|shaking)/i.test(e.name))).filter(e => /idle(\d+)?/i.test(e.name)))
      var idle = loadAnimation(sheet)
      sp1 = createSprite(innerWidth / 2, innerWidth / 2, 100)
      sp1.scale = 1
      sp1.shapeColor = color('skyblue')
      sp1.immovable = true
      idle.frameDelay = 3

      var frame: SpriteFrame['frame'], img: Image, width: number, height: number
      var scale = 0.3
      sp1.draw = function() {
         fill(this.shapeColor.toString());
         // var speed = this.getSpeed()
         frame = idle.getFrameImage().frame
         img = sheet.image.get(frame.x, frame.y, frame.width, frame.height)
         width = img.width * scale
         height = img.height * scale
         img.resize(width, height)

         push();
         if ((frame as any).r) {
            rotate(radians(-90))
         }
         image(img, 0, 0, width, height)
         pop();

         idle.update()
      }
      // sp1.maxSpeed = 20
      // sp1.mouse
   })
   
}

window.setup = () => {
   createCanvas(innerWidth, innerHeight)
   drawBg()
}

window.windowResized = () => {
   resizeCanvas(innerWidth, innerHeight)
}

window.draw = () => {
   drawBg()

   drawSprites()
}
