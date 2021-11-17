import { LoDashStatic } from 'lodash';
import 'p5/global';
import 'gsap';
import _p5 from 'p5';

type AnyObject<T = any, K extends string = string> = Record<K, T>;

declare module '*.svg' {
   const data: string;
   export default data;
}

type Camera = {
   active: boolean;
   init: boolean;
   mouseX: number;
   mouseY: number;
   off(): void;
   on(): void;
   position: _p5.Vector;
   zoom: number;
};

type AllSprites = {
   add(s: Sprite): any;
   bounce(): any;
   clear(): any;
   collide(): any;
   contains(sprite): any;
   displace(): any;
   draw(): any;
   get(i): Sprite;
   indexOf(item): number;
   maxDepth(): number;
   minDepth(): number;
   overlap(): any;
   remove(item): any;
   removeSprites(): any;
   size(): number;
   toArray(): any[];
};

type p5Prot = typeof p5.prototype;

declare global {
   var p5: typeof _p5 & P5Play;
   var camera: Camera;
   interface Window extends p5Prot {
      p5: typeof p5;
   }
   type SpriteFrame = {
      name: string;
      frame: AnyObject<number, 'x' | 'y' | 'width' | 'height'>;
   };

   interface P5Play {
      prototype: {
         createSprite(
            x: number,
            y: number,
            width?: number,
            height?: number
         ): Sprite;
         loadSpriteSheet(
            path: string,
            w: number,
            h: number,
            n: number
         ): SpriteSheet;
         loadSpriteSheet(path: string, frames: SpriteFrame[]): SpriteSheet;
         loadAnimation(sheet: SpriteSheet): Animation;
         loadAnimation(...args: string[]): Animation;
         camera: Camera;
         drawSprites(g?: any): any;
         drawSprite(arg: Sprite): any;
         animation(anim: Animation, x: number, y: number);
         allSprites: AllSprites;
      };
   }

   class Sprite {
      constructor(...args: any[]) {}
      position: _p5.Vector;
      previousPosition: _p5.Vector;
      newPosition: _p5.Vector;
      deltaX: number;
      deltaY: number;
      velocity: _p5.Vector;
      maxSpeed: number;
      friction: number;
      collider: any;
      colliderType: 'default' | 'custom' | 'image';
      touching: Record<'left' | 'right' | 'bottom' | 'top', boolean>;
      mass: number;
      immovable: boolean;
      restitution: number;
      rotation: number;
      rotationSpeed: number;
      rotateToDirection: boolean;
      depth: number;
      scale: number;
      visible: true;
      mouseActive: boolean;
      mouseIsOver: boolean;
      mouseIsPressed: boolean;
      width: number;
      height: number;
      originalWidth: number;
      originalHeight: number;
      removed: boolean;
      life: number;
      debug: boolean;
      shapeColor: _p5.Color;
      groups: any[];
      animation: Animation;
      onMouseOver: () => any;
      onMouseOut: () => any;
      onMousePressed: () => any;
      onMouseReleased: () => any;

      AABBops(type, target, callback): any;
      addAnimation(f: string, a?: Animation): any;
      addImage(): any;
      addSpeed(speed, angle): any;
      addToGroup(group): any;
      attractionPoint(magnitude, pointX, pointY): any;
      bounce(target, callback): any;
      changeAnimation(label: string): any;
      changeImage(label): any;
      collide(target, callback): any;
      displace(target, callback): any;
      display(): any;
      draw(this: Sprite): any;
      getAnimationLabel(): string;
      getBoundingBox(): any;
      getDirection(): any;
      getSpeed(): any;
      limitSpeed(max: number): any;
      mirrorX(dir: number): any;
      mirrorY(dir: number): any;
      mouseUpdate(): any;
      overlap(target, callback): any;
      overlapPixel(pointX, pointY): any;
      overlapPoint(pointX, pointY): any;
      remove(): any;
      setCollider(type, offsetX, offsetY, width, height): any;
      setDefaultCollider(): any;
      setSpeed(speed, angle): any;
      setVelocity(x, y): any;
      update(): any;
   }

   class Animation {
      constructor(...args: any[]) {}
      changeFrame(f): any;
      clone(): any;
      draw(x, y, r): any;
      frameChanged: boolean;
      frameDelay: number;
      getFrame(): number;
      getFrameImage(): SpriteFrame;
      getHeight(): number;
      getImageAt(f): any;
      getLastFrame(): number;
      getWidth(): number;
      goToFrame(toFrame): any;
      imageCollider: boolean;
      images: SpriteFrame[];
      looping: boolean;
      nextFrame(): any;
      offX: number;
      offY: number;
      onComplete(): any;
      play(): any;
      playing: boolean;
      previousFrame(): any;
      rewind(): any;
      spriteSheet: SpriteSheet;
      stop(): any;
      update(): any;
      visible: boolean;
   }

   class SpriteSheet {
      constructor(...args: any[]) {}
      clone(): SpriteSheet;
      drawFrame(frame_name, x, y, width, height): any;
      frame_height: number;
      frame_width: number;
      frames: SpriteFrame[];
      image: _p5.Image;
      num_frames: number;
   }
}
