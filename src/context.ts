export const canvas = document.querySelector('canvas') as HTMLCanvasElement;
export const ctx =  canvas.getContext('2d') as CanvasRenderingContext2D
canvas.width = innerWidth;
canvas.height = innerHeight;
export var centerX = canvas.width / 2;
export var centerY = canvas.height / 2;
export var mouse = {
   position: {
      x: 0,
      y: 0
   },
   pressPosition: {
      x: 0,
      y: 0
   },
   releasePosition: {
      x: 0,
      y: 0
   },
   isPressed: false,
   released: () => {}
}

window.addEventListener('resize', () => {
   centerX = canvas.width / 2;
   centerY = canvas.height / 2;
   canvas.width = innerWidth;
   canvas.height = innerHeight;
   // render.options.height = innerHeight;
   // render.options.width = innerWidth;
});

canvas.addEventListener('mousemove', e => {
   mouse.position.x = e.offsetX
   mouse.position.y = e.offsetY
})

canvas.addEventListener('mousedown', e => {
   mouse.pressPosition.x = e.offsetX
   mouse.pressPosition.y = e.offsetY

   mouse.isPressed = true
})

canvas.addEventListener('mouseup', e => {
   mouse.releasePosition.x = e.offsetX
   mouse.releasePosition.y = e.offsetY
   mouse.isPressed = false

   mouse.released()
})
