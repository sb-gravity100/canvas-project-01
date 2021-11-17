interface Math {
   toRadians(deg: number): number;
   distribute(count: number, distributedBy: number): (i: number) => number;
   randomNumber<T>(
      max: number,
      min?: number,
      floor?: boolean,
      rand?: T,
      ...args: T extends (...args: any[]) => number ? Parameters<T> : never
   ): number;
   noise(i: number | [x: number, y?:number, z?:number], max: number, min?: number,
      floor?: boolean): number
}

Math.toRadians = function toRadians(deg: number) {
   return deg * (Math.PI / 180);
};

Math.randomNumber = function randomNumber<T>(
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

Math.distribute = function distribute(count: number, distributedBy: number) {
   var inc = distributedBy / count
   return (i) => inc * i
}

Math.noise = function generateNoise(i, max, min = 0, floor) {
   let num: number;
   if (Array.isArray(i)) {
      num = require('@chriscourses/perlin-noise').noise(...i) * (max - min) + 1 + min;
   } else {
      num = require('@chriscourses/perlin-noise').noise(i) * (max - min) + 1 + min;
   }
   return floor ? Math.floor(num) : num;
}
