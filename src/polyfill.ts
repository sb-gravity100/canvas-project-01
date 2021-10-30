interface Math {
   randomNum(max: number, min?: number, precision?: number): number;
   noise(seed?: number): (x: number, y?: number, z?: number) => number;
   noiseDetail(lod: number, falloff?: number): void;
}

Math.randomNum = function (max, min = 0, precision = 20) {
   let num: number;
   num = require('faker').datatype.number({
      min,
      max,
      precision,
   });
   return num;
};

Math.noiseDetail = require('@chriscourses/perlin-noise').noiseDetail;

Math.noise = function (seed) {
   if (seed) {
      require('@chriscourses/perlin-noise').noiseSeed(seed);
   }
   return require('@chriscourses/perlin-noise').noise;
};
