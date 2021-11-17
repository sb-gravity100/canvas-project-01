// @ts-nocheck
// import _ from 'lodash';
import Matter, { Engine, Bodies, Render, Runner, Composite } from 'matter-js';
// import { randomHSL } from './utils';

var width = innerWidth;
var height = innerHeight;
var centerX = width / 2;
var centerY = height / 2;
var options: Matter.IRendererOptions = {
   height,
   width,
   wireframes: true,
   hasBounds: true
   // showPositions: true,
   // showCollisions: true,
   // showAxes: true,
   // showVelocity: true,
   // showAngleIndicator: true,
   // showStats: true,
   // showVertexNumbers: true,
   // showBroadphase: true,
};

Matter.Common.setDecomp(require('poly-decomp'));

var engine = Engine.create();
var render = Render.create({
   engine: engine,
   element: document.body,
   options,
   // context:
});
var mouse = Matter.Mouse.create(render.canvas),
   mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
         stiffness: 0.25,
         render: {
            visible: true,
         },
      },
   }),
   world = engine.world,
   runner = Runner.create();
render.mouse = mouse;

Composite.add(world, mouseConstraint)
Render.run(render);
Runner.run(runner, engine);
Render.lookAt(render, {
   min: {
      x: -300,
      y: -300
   },
    max: {
       x: render.options.width + 300,
       y: render.options.height + 300,
    }
});

const size = 100;
const wallOpt: Matter.IBodyDefinition = {
   isStatic: true,
   render: {
      fillStyle: 'lightblue',
      // lineWidth: 0,
      strokeStyle: 'transparent'
   }
}
// let angle = 0;
function setWalls() {
   const walls = {
      ground: Bodies.rectangle(centerX, height, width, size, wallOpt),
      top: Bodies.rectangle(centerX, 0, width, size, wallOpt),
      left: Bodies.rectangle(-size / 2, centerY, size, height + size, wallOpt),
      right: Bodies.rectangle(width + size / 2, centerY, size, height + size, wallOpt),
   };

   for (var i in walls) {
      Composite.add(world, walls[i]);
   }
}


async function getTerrain() {
   var res = await fetch('/svg/svgexport-5.svg')
   var raw = await res.text()
   var svg = new DOMParser().parseFromString(raw, 'image/svg+xml')
   var paths = Array.from(svg.querySelectorAll('path'))
   console.log(paths)
   var vert = paths.map(p => Matter.Svg.pathToVertices(p))


   var terrain = Bodies.fromVertices(400, 350, vert, {
      isStatic: true,
   }, true);
   Composite.add(world, terrain)
}

getTerrain()
