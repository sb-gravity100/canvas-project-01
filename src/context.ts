import { Bodies, Engine, Runner, Render, Composite, Vector } from 'matter-js';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
export const width = 800;
export const height = 600;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var engine = Engine.create();
var render = Render.create({
   engine,
   canvas,
   options: {
      background: 'coral',
      width,
      height,
   },
});
var runner = Runner.create();

window.addEventListener('resize', () => {
   var centerX = width / 2;
   var centerY = height / 2;
   // render.options.height = innerHeight;
   // render.options.width = innerWidth;
});

export function addToWorld(objects: Parameters<typeof Composite.add>[1]) {
   return Composite.add(engine.world, objects);
}

function createWalls(thick = 10) {
   const rad = thick / 2;
   const ground = Bodies.rectangle(centerX, height - rad, width * 3, thick, {
      isStatic: true,
   });
   addToWorld(ground);
}

createWalls();

export function runEngine() {
   Render.run(render);
   Runner.run(runner, engine);
}
