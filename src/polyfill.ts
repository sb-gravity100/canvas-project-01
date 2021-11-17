interface Math {
   distribute(count: number, distributedBy: number): (i: number) => number;
   randomNumber<T>(
      max: number,
      min?: number,
      floor?: boolean,
      rand?: T,
      ...args: T extends (...args: any[]) => number ? Parameters<T> : never
   ): number;
}

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
