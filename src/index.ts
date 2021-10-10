import {
   root,
   // centerX,
   // centerY,
   canvas,
   globalTs,
   setGlobalTs,
   centerX,
   centerY,
   mouseX,
   mouseY,
} from './context';
import { createElement, randomHSL, randomNumber } from './utils';
import { Projectile, Circle, Particle, FireWorks } from './Objects';
import './style.scss';
import { clearCanvas } from './utils';
import _ from 'lodash';
import gsap, { Quart } from 'gsap'
type VoidHookMethods = Record<
   'animate' | 'start' | 'stop' | 'toggle',
   () => void
>;

type ParticleHookReturn<T extends InstanceType<new (...args: any) => any>> = [
   T[],
   VoidHookMethods
];
const navBar = createElement('nav-bar');
root.prepend(navBar);

const numberLogs = createElement('number-logs', navBar);
const toggleButton = createElement('toggle-button', navBar, 'button');
toggleButton.innerHTML = 'Toggle'
let oldTs = 0;

function useFireworks(interval: number): ParticleHookReturn<FireWorks> {
   var fireworks: FireWorks[] = [];
   let started = false;
   let id: any;

   function animate() {
      if (started) {
         fireworks.forEach((e, i) => {
            if (e.isDone) {
               setTimeout(() => fireworks.splice(i, 1), 0);
            }
            e.update();
         });
      }
   }

   function start() {
      started = true;
      id = setInterval(() => {
         fireworks.push(new FireWorks());
      }, interval);
   }

   function stop() {
      started = false;
      fireworks.splice(0, fireworks.length)
      clearInterval(id);
   }

   function toggle() {
      if (started) {
         stop();
      } else {
         start();
      }
   }

   return [fireworks, { animate, start, stop, toggle }];
}

function init() {
   const [fireworks, fireworksDispatch] = useFireworks(1500);
   const circle = new Projectile(mouseX, mouseY, 13)
   const timeline = gsap.timeline()
   const obj = {
      canvasFill: 'hsla(0, 0%, 0%, 0.1)'
   }
   circle.fill = randomHSL(undefined, 56, 55)
   circle.shadow = circle.fill
   circle.shadowBlur = 25
   circle.extra.fill = circle.fill
   circle.extra.radius = circle.radius

   toggleButton.addEventListener('click', () => {
      fireworksDispatch.toggle()
   })

   canvas.addEventListener('mousedown', () => {
      circle.shadowBlur = 0
      timeline.to([circle, obj], {
         radius: canvas.height,
         fill: randomHSL(0, 29, 40, 1),
         ease: 'quad.out()',
         canvasFill: 'hsla(250, 15%, 30%, 0.5)',
         duration: 2
      }).to(circle, {
         ...circle.extra,
         ease: 'none',
         shadowBlur: 25,
         duration: 1,
      })
   })

   canvas.addEventListener('mouseup', () => {
      timeline.to([circle, obj], {
         radius: canvas.height,
         fill: randomHSL(0, 29, 40, 1),
         ease: 'expo.in()',
         canvasFill: 'hsla(0, 0%, 0%, 0.1)',
         duration: 1
      }).to(circle, {
         ...circle.extra,
         ease: 'expo.in()',
         shadowBlur: 25,
         duration: 0.5,
      })
   })

   function animate(ts: number) {
      setGlobalTs((ts - oldTs) / 1000);
      oldTs = ts;
      clearCanvas(obj.canvasFill);

      gsap.to(circle, {
         x: mouseX,
         y: mouseY,
      })

      circle.update()
      fireworksDispatch.animate();

      // numberLogs.innerText = `${fireworks.length}`;

      requestAnimationFrame(animate);
   }

   requestAnimationFrame(animate);
}

init()
