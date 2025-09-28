export const canvas = document.querySelector('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
canvas.width = innerWidth;
canvas.height = innerHeight;
export var centerX = canvas.width / 2;
export var centerY = canvas.height / 2;
export var mouse = {
   position: {
      x: 0,
      y: 0,
   },
   pressPosition: {
      x: 0,
      y: 0,
   },
   releasePosition: {
      x: 0,
      y: 0,
   },
   isDown: false,
   released: () => {},
};

canvas.addEventListener('contextmenu', (e) => {
   e.preventDefault();
});

window.addEventListener('resize', () => {
   centerX = canvas.width / 2;
   centerY = canvas.height / 2;
   canvas.width = innerWidth;
   canvas.height = innerHeight;
   // render.options.height = innerHeight;
   // render.options.width = innerWidth;
});

addEventListener('mousemove', (e) => {
   mouse.position.x = e.offsetX;
   mouse.position.y = e.offsetY;
});

addEventListener('mousedown', (e) => {
   mouse.pressPosition.x = e.offsetX;
   mouse.pressPosition.y = e.offsetY;
   console.log('mousedown');

   mouse.isDown = true;
});

addEventListener('mouseup', (e) => {
   mouse.releasePosition.x = e.offsetX;
   mouse.releasePosition.y = e.offsetY;
   mouse.isDown = false;

   mouse.released();
});
