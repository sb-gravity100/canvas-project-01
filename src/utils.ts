// import faker from 'faker'
import gsap from 'gsap';

export function randomHSL(h?: any, s?: any, l?: any, a?: any) {
   let hue = typeof h === 'number' ? h : Math.random() * 360;
   let sat = typeof s === 'number' ? s : Math.random() * 100;
   let lum = typeof l === 'number' ? l : Math.random() * 100;
   let alpha = a || 1;
   return `hsla(${hue}, ${sat}%, ${lum}%, ${alpha})`;
}

export function checkCircleCollision(c1: any, c2: any) {
   const x1 = c1.x,
      x2 = c2.x,
      y1 = c1.y,
      y2 = c2.y;
   let collide = false;
   var dist = Math.hypot(x2 - x1, y2 - y1);
   if (dist - c1.radius - c2.radius < 3) {
      collide = true;
   }
   return collide;
}
export function randomNumber(max: number, min: number = 0, floor?: boolean) {
   let num: number;
   num = Math.random() * (max - min) + 1 + min;
   return floor ? Math.floor(num) : num;
}

export function createElement(
   className: string,
   parent?: HTMLElement,
   elementName: string = 'div'
) {
   var elem = document.createElement(elementName);
   if (parent) {
      parent.append(elem);
   }
   elem.classList.add(className);
   return elem;
}

export function sineWave(
   index: number,
   len: number = 0.01,
   amp: number = 100,
   freq: number = 0
) {
   return Math.sin(index * len + freq) * amp;
}

export function randomInterval(callback: Function, max: number, min: number) {
   function randFunc() {
      setTimeout(() => {
         callback();
         randFunc();
      }, randomNumber(max, min, true));
   }
   randFunc();
}

export const distributeAngle = (objectCount: number) =>
   (Math.PI * 2) / objectCount;
export const distributeColor = (objectCount: number) => 360 / objectCount;

export function toRadians(deg: number) {
   return deg * (Math.PI / 180);
}

export function callIfFunction<T>(
   f: T,
   ...args: T extends (...args: any[]) => any ? Parameters<T> : never
) {
   if (typeof f === 'function') {
      f(...args);
   }
}
