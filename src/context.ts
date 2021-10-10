document.title = 'Hello Warudo';
export const root = document.querySelector('#root') as HTMLDivElement;
export const canvas = document.createElement('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
root.append(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;
let isMouseDown = false;
export var centerX = canvas.width / 2,
   centerY = canvas.height / 2;
export var mouseX = centerX,
   mouseY = centerY;
export var clickX = 0, clickY = 0;
export var globalTs = 0;
export const gravity = 0.01, friction = 0.99;

export function setGlobalTs(i: number) {
   globalTs = i;
}

addEventListener('resize', () => {
   canvas.height = innerHeight;
   canvas.width = innerWidth;
   centerX = canvas.width / 2;
   centerY = canvas.height / 2;
});

// canvas.addEventListener('mousedown', handleMouseHold);
// canvas.addEventListener('mouseup', handleMouseHold);
canvas.addEventListener('click', handleMouseHold);
canvas.addEventListener('mousemove', handleMouseHold);

function handleMouseHold(e: MouseEvent) {
   if (e.type === 'mousemove') {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
   }

   if (e.type === 'click') {
      clickX = e.offsetX;
      clickY = e.offsetY;
   }
}
