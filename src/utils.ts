import gsap from 'gsap'

export function resizeFit(maxWidth: number, maxHeight: number) {
   return (srcWidth: number, srcHeight: number) => {
      var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
   };
}

export function maxHeight(maxHeight: number, width: number, height: number) {
   const ratio = maxHeight / height;
   return { width: width * ratio, height: maxHeight };
};

// import faker from 'faker'
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
   if (dist - c1.radius - c2.radius < 1) {
      collide = true;
   }
   return collide;
}
export function randomNumber<T>(
   max: number,
   min: number = 0,
   floor?: boolean,
   rand?: T,
   ...args: T extends (...args: any[]) => number ? Parameters<T> : never
) {
   let num: number;
   let randomFunc: any = rand || Math.random;
   num = randomFunc(...args) * (max - min) + 1 + min;
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

export function callIfFunction<T>(
   f: T,
   ...args: T extends (...args: any[]) => any ? Parameters<T> : never
) {
   if (typeof f === 'function') {
      f(...args);
   }
}

export function myTicker(callback: gsap.TickerCallback, fps?: number) {
   const ticker = gsap.ticker;

   ticker.fps(fps || 60);
   ticker.add(callback);
}

function rotateCircle(vX: number, vY: number, angle: number): [x: number, y: number] {
   const sinA = Math.sin(angle)
   const cosA = Math.cos(angle)
   const x = vX * cosA - vY * sinA
   const y = vX * sinA + vY * cosA
   return [x, y]
}

export function bounceCollide(a: any, b: any) {
   const vXDiff = a.extra.vX - b.extra.vX
   const vYDiff = a.extra.vY - b.extra.vY

   const xDist = b.x - a.x
   const yDist = b.y - a.y

   if (vXDiff * xDist + vYDiff * yDist >= 0) {
      const angle = -Math.atan2(b.y - a.y, b.x - a.x)

      const mA = a.extra.mass
      const mB = b.extra.mass

      const sumMass = mA + mB
      const diffMass = mB - mA
      // const prodMass = mA * mB

      const [uAx, uAy] = rotateCircle(a.extra.vX, a.extra.vY, angle)
      const [uBx, uBy] = rotateCircle(b.extra.vX, b.extra.vY, angle)

      const vXa = uAx * (diffMass) / sumMass + uBx * 1.8 * mB / sumMass
      const vXb = uBx * (diffMass) / sumMass + uAx * 1.8 * mB / sumMass

      const [vFAx, vFAy] = rotateCircle(vXa, uAy, -angle)
      const [vFBx, vFBy] = rotateCircle(vXb, uBy, -angle)

      a.extra.vX = vFAx
      a.extra.vY = vFAy

      b.extra.vX = vFBx
      b.extra.vY = vFBy
   }
}
