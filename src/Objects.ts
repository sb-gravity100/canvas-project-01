import { Font, Image, Vector } from 'p5';

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
   private width = 0;
   private height = 0;
   visible = true;

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
      if (!this.visible) return;
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
         var width = frame.width;
         var height = frame.height;
         this.width = width * this.scale;
         this.height = height * this.scale;
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
      var index = this.animations.findIndex((v) => v.label === label);
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
         (v) => v.label === this.currentAnimationLabel
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

export class CanvasUIElement {
   p5: p5;
   position: Vector;
   size: Vector;
   rotation = 0;
   scale = 1;
   visible = true;
   constructor(p: p5, size: Vector, position: Vector) {
      this.p5 = p;
      this.size = size;
      this.position = position;
      addEventListener('click', () => {
         this.clickEvent();
      });
   }
   draw() {}
   update() {}
   onClick() {}
   clickEvent() {
      if (!this.visible) return;
      const mouseX = this.p5.mouseX;
      const mouseY = this.p5.mouseY;
      const actualSizeX = this.size.x * this.scale;
      const actualSizeY = this.size.y * this.scale;
      const left = this.position.x - actualSizeX / 2;
      const right = this.position.x + actualSizeX / 2;
      const top = this.position.y - actualSizeY / 2;
      const bottom = this.position.y + actualSizeY / 2;
      if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
         this.onClick();
      }
   }
   onHover() {}
   onUnhover() {}
   onMouseDown() {}
   onMouseUp() {}
   onKeyPressed() {}
   onKeyReleased() {}
}

export class UIButton extends CanvasUIElement {
   text = '';
   textSize = 16;
   textColor = '#000000';
   textFont: string | object = 'Arial';
   backgroundColor = '#ffffff';
   borderColor = '#000000';
   borderWidth = 1;
   borderRadius = 0;
   hoverBackgroundColor = '#dddddd';
   hoverTextColor = '#000000';
   isHovering = false;
   constructor(p: p5, size: Vector, position: Vector, text: string) {
      super(p, size, position);
      this.text = text;
   }
   draw() {
      if (!this.visible) return;
      this.p5.push();
      this.p5.translate(this.position.x, this.position.y);
      this.p5.rotate(this.p5.radians(this.rotation));
      this.p5.scale(this.scale);
      this.p5.rectMode(this.p5.CENTER);
      this.p5.textFont(this.textFont);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.textSize(this.textSize);
      this.p5.stroke(this.borderColor);
      this.p5.strokeWeight(this.borderWidth);
      if (this.isHovering) {
         this.p5.fill(this.hoverBackgroundColor);
      } else {
         this.p5.fill(this.backgroundColor);
      }
      this.p5.rect(0, 0, this.size.x, this.size.y, this.borderRadius);
      if (this.isHovering) {
         this.p5.fill(this.hoverTextColor);
      } else {
         this.p5.fill(this.textColor);
      }
      this.p5.text(this.text, 0, 0);
      this.p5.pop();
   }
   update() {
      if (!this.visible) return;
      const mouseX = this.p5.mouseX;
      const mouseY = this.p5.mouseY;
      const left = this.position.x - this.size.x / 2;
      const right = this.position.x + this.size.x / 2;
      const top = this.position.y - this.size.y / 2;
      const bottom = this.position.y + this.size.y / 2;
      if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
         if (!this.isHovering) {
            this.isHovering = true;
            this.onHover();
            // check for click events
            if (this.p5.mouseIsPressed) {
               this.onMouseDown();
            }
         }
      } else {
         if (this.isHovering) {
            this.isHovering = false;
            this.onUnhover();
         }
      }
   }
}

export class UIImage extends CanvasUIElement {
   image?: Image;
   constructor(p: p5, size?: Vector, position?: Vector, image?: Image) {
      super(
         p,
         size || p.createVector(100, 100),
         position || p.createVector(100, 100)
      );
      if (image) {
         this.image = image;
      }
   }
   draw() {
      if (!this.image) return;
      if (!this.visible) return;
      this.p5.push();
      this.p5.translate(this.position.x, this.position.y);
      this.p5.rotate(this.p5.radians(this.rotation));
      this.p5.scale(this.scale);
      this.p5.imageMode(this.p5.CENTER);
      this.p5.image(
         this.image,
         0,
         0,
         this.size.x * this.scale,
         this.size.y * this.scale
      );
      this.p5.pop();
   }
}

export class UIText extends CanvasUIElement {
   text = '';
   textSize = 16;
   textColor = '#000000';
   textAlign: 'left' | 'center' | 'right' = 'center';
   textFont: string | object = 'Arial';
   textBorderColor = '#000000';
   textBorderWidth = 0;
   textOpacity = 1;
   constructor(p: p5, position: Vector, text: string) {
      super(p, p.createVector(0, 0), position);
      this.text = text;
   }
   draw() {
      if (!this.visible) return;
      this.p5.push();
      this.p5.translate(this.position.x, this.position.y);
      this.p5.rotate(this.p5.radians(this.rotation));
      this.p5.scale(this.scale);
      this.p5.textAlign(
         this.textAlign === 'left'
            ? this.p5.LEFT
            : this.textAlign === 'right'
            ? this.p5.RIGHT
            : this.p5.CENTER,
         this.p5.CENTER
      );
      if (this.textBorderWidth > 0) {
         this.p5.stroke(this.textBorderColor);
         this.p5.strokeWeight(this.textBorderWidth);
      }
      this.p5.textSize(this.textSize);
      this.p5.textFont(this.textFont);
      this.p5.fill(this.textColor);
      // opacity
      this.p5.text(this.text, 0, 0);
      this.p5.pop();
   }
   update() {}
}
