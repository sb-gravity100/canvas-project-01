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
import {
   createElement,
   distributeColor,
   randomHSL,
   randomNumber,
   snapToCanvas,
   toRadians,
} from './utils';
// import { Projectile, Circle, Particle, FireWorks } from './Objects';
import './style.scss';
import { clearCanvas } from './utils';
import _ from 'lodash';
import gsap from 'gsap';
import { noise as randomNoise } from '@chriscourses/perlin-noise';
import { useCircle } from './hooks';

const navBar = createElement('nav-bar', root);

const numberLogs = createElement('number-logs', navBar);
const toggleButton = createElement('toggle-button', navBar, 'button');
toggleButton.innerHTML = 'Toggle';
let oldTs = 0;

function init() {
   const objAmount = 100;
   var defaultBackground = 'rgba(0, 0, 0, 0.06)';
   const [, circleMethods] = useCircle({
      onStart: (c) => {
         c.forEach((e, i) => {
            e.extra.noise = i * 0.01;
            e.extra.noiseSpeed = 0.009;
            const fillHue = -distributeColor(objAmount) * i;
            e.fill = randomHSL(fillHue, 70, 50);
            // e.shadow = randomHSL(fillHue, 50, 50, 0.5);
            e.radius = 10;

            e.x = randomNoise(e.extra.noise) * canvas.width;
            e.y = randomNoise(e.extra.noise + 100) * canvas.height;
            e.extra.widthNoise = randomNoise(e.extra.noise) * canvas.width;
            e.extra.heightNoise =
               randomNoise(e.extra.noise + 100) * canvas.height;

            addEventListener('mousedown', () => {
               gsap.to(e.extra, {
                  noiseSpeed: 0.01,
                  duration: 0.5,
                  alpha: 0.08,
               });
               defaultBackground = 'rgba(70, 70, 70, 0.1)';
            });
            addEventListener('mouseup', () => {
               gsap.to(e.extra, {
                  noiseSpeed: 0.004,
                  duration: 0.5,
                  alpha: 1,
               });
               defaultBackground = 'rgba(0, 0, 0, 0.1)';
            });
         });
      },
      onUpdate(c) {
         const { noiseSpeed, noise, alpha } = c.extra;
         c.extra.noise += noiseSpeed;
         c.alpha = alpha;
         const x = (c.extra.widthNoise = randomNoise(noise) * canvas.width);
         const y = (c.extra.heightNoise =
            randomNoise(noise + 100) * canvas.height);

         gsap.to(c, {
            x,
            y,
         });
      },
      autoplay: true,
      amount: objAmount,
   });

   function animate(ts: number) {
      setGlobalTs((ts - oldTs) / 1000);
      oldTs = ts;
      clearCanvas(defaultBackground);

      circleMethods.animate();
      // fireworksDispatch.animate();

      // numberLogs.innerText = `${noise(obj.noiseX + 19)}${noise(obj.noiseX + 11)}`;

      requestAnimationFrame(animate);
   }

   requestAnimationFrame(animate);
}

init();
