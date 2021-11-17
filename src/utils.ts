export function resizeFit(maxWidth: number, maxHeight: number) {
   return (srcWidth: number, srcHeight: number) => {
      var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
   };
}

export function maxHeight(maxHeight: number, width: number, height: number) {
   const ratio = maxHeight / height;
   return { width: width * ratio, height: maxHeight };
};

// import faker from 'faker'
export function randomHSL(h?: any, s?: any, l?: any, a?: any) {
   let hue = typeof h === 'number' ? h : Math.random() * 360;
   let sat = typeof s === 'number' ? s : Math.random() * 100;
   let lum = typeof l === 'number' ? l : Math.random() * 100;
   let alpha = a || 1;
   return `hsla(${hue}, ${sat}%, ${lum}%, ${alpha})`;
}

export function randomNumber<T>(
   max: number,
   min: number = 0,
   floor?: boolean,
   rand?: T,
   ...args: T extends (...args: any[]) => number ? Parameters<T> : never
) {
   let num: number;
   let randomFunc: any = rand || Math.random;
   num = randomFunc(...args) * (max - min) + 1 + min;
   return floor ? Math.floor(num) : num;
}

export function createElement(
   className: string,
   parent?: HTMLElement,
   elementName: string = 'div'
) {
   var elem = document.createElement(elementName);
   if (parent) {
      parent.append(elem);
   }
   elem.classList.add(className);
   return elem;
}

export function randomInterval(callback: Function, max: number, min: number) {
   function randFunc() {
      setTimeout(() => {
         callback();
         randFunc();
      }, randomNumber(max, min, true));
   }
   randFunc();
}

export function callIfFunction<T>(
   f: T,
   ...args: T extends (...args: any[]) => any ? Parameters<T> : never
) {
   if (typeof f === 'function') {
      f(...args);
   }
}
