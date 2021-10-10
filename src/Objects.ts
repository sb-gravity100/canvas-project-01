import { ctx, friction, globalTs, gravity, canvas } from './context';
import { distributeAngle, randomHSL, randomNumber, snapToCanvas } from './utils';
// import faker from 'faker'
import _ from 'lodash';
import gsap from 'gsap'
import { nanoid } from 'nanoid';

type Maybe<T = any> = T | null | undefined;
type DrawFunction<K = any> = (this: K, context: typeof ctx) => void;
type UpdateFunction<K = any, T = any> = (this: K, obj: T) => void;
type AnyRecord = {
   [p in string]: any;
};

export class Text {
   _id: string;
   extra: AnyRecord = {};
   x: number;
   y: number;
   text = '';
   fill? = '#000';
   stroke?: string;
   font = 'Arial 30px';

   constructor(x: number, y: number) {
      this._id = nanoid();
      this.x = x;
      this.y = y;
   }

   draw(drawFunc?: Maybe<DrawFunction<this>>) {
      if (typeof drawFunc === 'function') {
         drawFunc.call(this, ctx);
      } else {
         const { x, y, text, fill, stroke, font } = this;
         ctx.save();
         ctx.font = font;
         if (this.fill) {
            ctx.fillStyle = fill as string;
            ctx.fillText(text, x, y);
         }
         if (this.stroke) {
            ctx.strokeStyle = stroke as string;
            ctx.strokeText(text, x, y);
         }
         ctx.restore();
      }
   }

   update(...args: any[]): void;
   update(
      updateFunc?: Maybe<UpdateFunction<this, this>>,
      drawFunc?: Maybe<DrawFunction<this>>
   ) {
      updateFunc?.call(this, this);
      this.draw(drawFunc);
   }
}

export class Circle {
   _id: string;
   extra: AnyRecord = {};
   x: number;
   y: number;
   radius: number;
   fill? = '#000';
   stroke?: string;
   shadow?: string;
   shadowBlur = 15;
   line = 1;
   alpha = 1;

   constructor(x: number, y: number, radius: number) {
      this._id = nanoid();
      this.radius = radius;
      this.x = x;
      this.y = y;
   }

   update(...args: any[]): void;
   update(
      updateFunc?: Maybe<UpdateFunction<this, this>>,
      drawFunc?: Maybe<DrawFunction<this>>
   ) {
      updateFunc?.call(this, this);
      this.draw(drawFunc);
   }

   draw(drawFunc?: Maybe<DrawFunction<this>>) {
      const { x, y, radius, fill, line, stroke, shadow, shadowBlur } = this;

      if (drawFunc) {
         drawFunc.call(this, ctx);
      } else {
         ctx.save()
         ctx.beginPath();
         ctx.arc(x, y, radius, 0, Math.PI * 2);
         ctx.closePath();
         ctx.globalAlpha = this.alpha
         ctx.lineWidth = line;
         if (shadow) {
            ctx.shadowColor = shadow
            ctx.shadowBlur = shadowBlur
         }
         if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
         }
         if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.stroke();
         }
         ctx.restore()
      }
   }
}

export class Projectile extends Circle {
   vX: number;
   vY: number;
   pow = 100;

   constructor(x: number, y: number, radius: number) {
      super(x, y, radius);
      this.vX = 0;
      this.vY = 0;
   }

   update(
      updateFunc?: Maybe<UpdateFunction<this, this>>,
      drawFunc?: Maybe<DrawFunction<this>>
   ) {
      this.x += this.vX * globalTs * this.pow;
      this.y += this.vY * globalTs * this.pow;

      updateFunc?.call(this, this);
      this.draw(drawFunc);
   }
}

export class Particle extends Projectile {
   constructor(x: number, y: number, radius: number) {
      super(x, y, radius);
      this.fill = randomHSL();
   }
}

export class FireWorks {
   _id: string;
   minFillHue: number;
   maxFillHue: number;
   sat: number;
   lum: number;
   startX: number;
   startY: number;
   maxHeight: number;
   objects: Particle[] = [];
   circle: Projectile;
   particlePow = 30;
   isKaboom = false;
   isDone = false;
   kaboom: VoidFunction

   constructor(startX?: number, startY?: number, maxHeight?: number, maxNum?: number, lum?: number, sat?: number) {
      let num = randomNumber(maxNum || 200, 50)
      const angleInc = distributeAngle(num)
      this._id = nanoid();

      this.startX = startX || randomNumber(canvas.width, 0);
      this.startY = startY || canvas.height + 20;
      this.circle = new Projectile(this.startX, this.startY, randomNumber(4, 1))
      this.maxHeight = maxHeight || randomNumber(canvas.height * 0.75, 0)

      const snappedX = snapToCanvas(randomNumber(this.startX * 1.5, this.startX * 0.5))
      console.log(snappedX)
      const angle = Math.atan2(-this.circle.y, snappedX - this.circle.x)
      this.circle.vX = Math.cos(angle)
      this.circle.vY = Math.sin(angle)
      this.circle.pow = randomNumber(600, 400)


      this.lum = lum || 50
      this.sat = sat || 50
      this.minFillHue = randomNumber(360);
      this.maxFillHue = randomNumber(360, this.minFillHue);
      this.circle.fill = randomHSL(randomNumber(this.maxFillHue, this.minFillHue), this.sat, this.lum)
      this.circle.shadow = this.circle.fill
      this.circle.shadowBlur = 20
      this.kaboom = () => {
         for (let i = 0; i < num; ++i) {
            const radius = randomNumber(3, 0.5)
            const part = new Particle(this.circle.x, this.circle.y, radius)
            part.vX = Math.cos(i * angleInc)
            part.vY = Math.sin(i * angleInc)
            part.pow = this.particlePow * radius
            part.fill = randomHSL(randomNumber(this.maxFillHue, this.minFillHue), this.sat, this.lum)
            part.shadow = part.fill
            part.shadowBlur = 10
            this.objects.push(part)
         }
      }
   }

   updateParticles() {
      if (this.objects.length === 0) {
         this.kaboom()
      }
      this.objects.forEach(e => {
         if (e.alpha > 0.009) {
            e.alpha *= 0.95
            e.radius *= 0.99
         } else {
            e.alpha = 0
            this.isDone = true
         }

         e.vX *= friction
         e.vY += gravity

         e.update()
      })
   }

   update() {
      if (this.isKaboom) {
         gsap.to(this.circle, {
            radius: 0,
         })
         this.circle.vX = 0
         this.circle.vY = 0
         this.updateParticles()
      }
         this.circle.vY += gravity
         this.circle.vX *= friction
         this.circle.radius *= 0.99

         if (this.circle.vY > -0.4 || this.circle.y < this.maxHeight) {
            this.isKaboom = true
         }

         this.circle.update()
   }
}
