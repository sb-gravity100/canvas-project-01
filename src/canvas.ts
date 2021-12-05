import { centerX, centerY, ctx, canvas } from './context'
import * as kr from 'khroma'

function clearCanvas(s?: string) {
   if (typeof s === 'string') {
      push()
      fill(s)
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      pop()
   } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
   }
}

function stroke(s: string) {
   ctx.strokeStyle = s
}

function noStroke() {
   ctx.strokeStyle = 'transparent'
}

function noFill() {
   ctx.fillStyle = 'transparent'
}

function fill(s: string) {
   ctx.fillStyle = s
}

function text(t: string, x: number, y: number) {
   ctx.fillText(t, x, y)
   ctx.strokeText(t, x, y)
}

function pop() {
   ctx.restore()
}

function push() {
   ctx.save()
}

function textSize(s: number) {
   // ctx.createImageData()
}

async function preload() {

}

function setup() {
   clearCanvas(kr.hsl(220, 40, 10, 0.4))
}

var draw = function draw(t, dt, frames, e) {
   clearCanvas(kr.hsl(220, 40, 10, 0.4))

   push()
   fill('white')
   ctx.fillText('Hello', centerX, centerY)
   pop()
} as gsap.TickerCallback

preload().then(setup).then(() => {
   gsap.ticker.add(draw)
})

