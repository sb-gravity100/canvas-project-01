import { FireWorks, Circle } from "./Objects";
import { callIfFunction } from './utils'
import _ from 'lodash'
// import { centerX, centerY } from "./context";


type VoidHookMethods = Record<
   'animate' | 'start' | 'stop' | 'toggle',
   () => void
>;

type Instance = InstanceType<new (...args: any) => any>
type useHookOptions<T> = {
   amount?: number
   onStart: (c: T[]) => any
   onStop?: (c: T[]) => any,
   onUpdate?: (c: T, i: number) => any,
   autoplay?: boolean
}
type ParticleHookReturn<T extends Instance> = [
   T[],
   VoidHookMethods
];

type FireWorksOptions = useHookOptions<FireWorks> & {
   interval?: number
}

type CircleOptions = useHookOptions<Circle> & {
   interval?: number
}

export function useFireworks(opts: FireWorksOptions): ParticleHookReturn<FireWorks> {
   let { onUpdate, onStop, onStart } = opts
   let fireworks: FireWorks[] = [];
   let started = false;
   let id: any;

   if (opts.autoplay) {
      start()
   }

   function animate() {
      if (started) {
         fireworks.forEach((e, i) => {
            if (e.isDone) {
               setTimeout(() => fireworks.splice(i, 1), 0);
            }
            callIfFunction(onUpdate, e, i)
            e.update();
         });
      }
   }

   function start() {
      started = true;
      callIfFunction(onStart, fireworks)
      id = setInterval(() => {
         fireworks.push(new FireWorks());
      }, opts.interval || 1000);
   }

   function stop() {
      started = false;
      callIfFunction(onStop, fireworks)
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
export function useCircle(opts: CircleOptions): ParticleHookReturn<Circle> {
   const circles: Circle[] = []
   let started = false;

   if (opts.autoplay) {
      start()
   }

   function animate() {
      if (started) {
         circles.forEach((c, i) => {
            callIfFunction(opts.onUpdate, c, i)
            c.update()
         })
      }
   }

   function start() {
      started = true;
      _.times(opts.amount || 1, () => circles.push(new Circle(0, 0, 10)))
      opts.onStart(circles)
   }

   function stop() {
      started = false;
      callIfFunction(opts.onStop, circles)
      circles.splice(0, circles.length)
   }

   function toggle() {
      if (started) {
         stop();
      } else {
         start();
      }
   }

   return [circles, {
         start,
         stop,
         animate,
         toggle,
      }]
}
