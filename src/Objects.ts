import { Image, Vector } from 'p5';

type SpriteFrameWithImage = SpriteFrame & {
   image: Image;
};

type AddAnimationFilter = (
   e: SpriteFrameWithImage[],
   image: Image
) => SpriteFrameWithImage[];
type AnimationLabel = {
   label: string;
   frames: SpriteFrameWithImage[];
};

export class SpriteAnimation {
   private cycles = 0;
   frames: SpriteFrameWithImage[] = [];
   image: Image;
   frameDelay = 4;
   scale = 1;
   p5: p5;
   private frame = 0;
   private animations: AnimationLabel[] = [];
   frameChanged = false;
   playing = true;
   position: Vector;
   rotation = 0;
   private currentAnimationLabel?: string;
   private _originalFrames: SpriteFrameWithImage[] = [];
   private _flipX = false;
   private _flipY = false;
   private averageWidth = 0;
   private averageHeight = 0;
   private width = 0
   private height = 0

   set originalFrames(v: SpriteFrameWithImage[]) {
      this._originalFrames = v;
   }

   get originalFrames() {
      return [...this._originalFrames];
   }

   constructor(p: p5) {
      this.p5 = p;
      this.position = p.createVector(0, 0);
      this.image = p.createImage(0, 0);
   }
   onComplete() {}

   draw(this: SpriteAnimation) {
      this._update();
      var scaleX = 1;
      var scaleY = 1;

      if (this._flipX) {
         scaleX = -1;
      }
      if (this._flipY) {
         scaleY = -1;
      }

      const frame = this.getFrameImage()?.frame;
      if (frame) {
         var { framex = 0, framey = 0 } = frame
         var width = frame.width;
         var height = frame.height;
         this.width = width * this.scale
         this.height = height * this.scale
         const img =
            this.getFrameImage()?.image ||
            (this.image.get(
               frame.x,
               frame.y,
               width || 0,
               height || 0
            ) as Image);
         var x = 0;
         var y = 0;
         this.p5.push();
         this.p5.translate(this.position.x, this.position.y);
         this.p5.rotate(this.p5.radians(this.rotation));
         this.p5.scale(scaleX * this.scale, scaleY * this.scale);
         this.p5.imageMode('center');
         this.p5.image(img, x, y, width, height);
         this.p5.pop();
      }
   }

   mirrorX(b?: boolean) {
      if (typeof b !== 'boolean') {
         this._flipX = !this._flipX;
      } else {
         this._flipX = b;
      }
   }

   mirrorY(b?: boolean) {
      if (typeof b !== 'boolean') {
         this._flipY = !this._flipY;
      } else {
         this._flipY = b;
      }
   }

   private _update() {
      this.cycles++;
      this.update();
   }

   update(this: SpriteAnimation) {
      var previousFrame = this.frame;
      // var previousAnimation = this.currentAnimationLabel
      // if (previousAnimation === this.currentAnimationLabel) {

      // }
      this.frameChanged = false;

      if (this.frames.length === 1) {
         this.frame = 0;
      }

      if (this.playing && this.cycles % this.frameDelay === 0) {
         if (this.frame === this.frames.length - 1) {
            this.frame = 0;
         } else {
            this.frame++;
         }
      }
      if (this.frame === this.frames.length - 1 && this.onComplete != undefined)
         this.onComplete();

      if (previousFrame !== this.frame) this.frameChanged = true;
   }

   getWidth() {
      return this.width;
   }

   getHeight() {
      return this.height;
   }

   getAverageWidth() {
      return this.averageWidth * this.scale;
   }

   getAverageHeight() {
      return this.averageHeight * this.scale;
   }

   getFrame() {
      return this.frame;
   }

   getFrameImage() {
      return this.frames[this.frame];
   }

   addAnimation(label: string, filter: AddAnimationFilter) {
      var frames = filter([...this._originalFrames], this.image.get());
      this.animations.push({
         label,
         frames,
      });
      this.changeAnimation(label);
   }

   removeAnimation(label?: string) {
      var index = this.animations.findIndex(v => v.label === label);
      if (index > -1) {
         this.animations.splice(index, 1);
      }
   }

   getAnimationLabel() {
      return this.currentAnimationLabel;
   }

   changeAnimation(label: string) {
      this.currentAnimationLabel = label;
      var res = this.animations.find(
         v => v.label === this.currentAnimationLabel
      );
      if (res) {
         // this.averageWidth = _.chain(res.frames)
         //    .map(v => Number(v.frame.width))
         //    .reduce((p, c) => p + c).divide(res.frames.length).value();
         // this.averageHeight = _.chain(res.frames)
         //    .map(v => Number(v.frame.height))
         //    .reduce((p, c) => p + c).divide(res.frames.length).value();
         this.frames = res.frames;
      }
      // console.log(this.averageHeight)
      // console.log(this.averageWidth)
      return this.currentAnimationLabel;
   }

   getLastFrame() {
      return this.frames.length - 1;
   }

   gotoFrame(i: number) {
      if (this.frames.length === 1) {
         this.frame = 0;
         return;
      }

      if (i < 0) {
         this.frame = this.frames.length - i;
      } else if (i > this.getLastFrame()) {
         this.frame = this.getLastFrame();
      } else {
         this.frame = i;
      }
   }
}
