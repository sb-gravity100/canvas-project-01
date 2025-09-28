import { Element, Image, SoundFile } from 'p5';
import { SpriteAnimation, UIButton, UIText } from './Objects';
import { mouse } from './context';

type AnyObject<T = any, K extends string = string> = Record<K, T>;
type Stereo = {
   voice?: any;
   inst?: any;
   playing: boolean;
   song: SongData;
};
const enum ArrowNotes {
   'up',
   'down',
   'left',
   'right',
   'idle',
}
type ArrowKeys = keyof typeof ArrowNotes;

let arrows = ['left', 'down', 'up', 'right', 'idle'];

function filterFramesRegExp<K extends SpriteFrame>(
   frames: K[],
   regexp: RegExp
) {
   return frames.filter((e) => regexp.test(e.name));
}

export function init(song, sprite) {
   let sketch = (p: p5) => {
      let centerX = p.windowWidth / 2;
      let centerY = p.windowHeight / 2;
      let ts = performance.now() / 1000;
      let fps = Math.floor(p.frameCount / ts);

      let name = 'zavodila',
         char2 = 'BOYFRIEND',
         char = 'ruv_sheet',
         gf = 'DDLCGF_ass_sets';

      let anim = new SpriteAnimation(p);
      let anim2 = new SpriteAnimation(p);
      let bgImg: Image;
      let charSelection: SpriteAnimation[];

      function drawBg() {
         p.clear();
         ts = performance.now() / 1000;
         fps = Math.floor(p.frameCount / ts);
         // camera
         p.push();
         p.translate(centerX, centerY);
         p.imageMode('center');
         p.image(bgImg, 0, 0, innerWidth);
         p.pop();
      }
      let mode = 'menu';
      let audio = {} as Stereo;
      let startFx: SoundFile[] = [];
      let toggleButton: Element;
      let flipP1: Element;
      let flipP2: Element;
      let volume: Element;
      let sizeP1: Element;
      let posP1: Element;
      let sizeP2: Element;
      let posP2: Element;
      let scale = 0.4;
      let scale2 = 0.4;
      let delay = 25;
      let gfAnim = new SpriteAnimation(p);
      let logo = p.loadImage('/assets/logo.png');
      let btnPressStart = new UIText(
         p,
         p.createVector(centerX, centerY * 1.8),
         'Press to Enter'
      );
      let btnReturnMenu = new UIButton(
         p,
         p.createVector(100, 80),
         p.createVector(innerHeight * 0.15, innerHeight * 0.9),
         'Back'
      );

      btnPressStart.textSize = 60;
      btnPressStart.textFont = 'Courier New';
      btnPressStart.textColor = 'white';
      btnPressStart.textBorderColor = 'black';
      btnPressStart.textBorderWidth = 4;

      btnReturnMenu.textSize = 35;
      btnReturnMenu.textColor = 'white';
      btnReturnMenu.textFont = 'Courier New';
      btnReturnMenu.backgroundColor = '#284b63';
      btnReturnMenu.borderRadius = 5;
      btnReturnMenu.hoverBackgroundColor = '#153243';
      btnReturnMenu.onClick = () => {
         mode = '';
         setTimeout(() => {
            mode = 'menu';
         }, 500);
         alpha = 0;
      };
      // btnReturnMenu.hoverBackgroundColor =

      toggleButton = p.createButton('Toggle');
      flipP1 = p.createButton('Flip Player1');
      flipP2 = p.createButton('Flip Player2');
      volume = p.createSlider(0, 1, 0.1, 0.01);
      sizeP1 = p.createSlider(0, 1, 0, 0.01);

      posP2 = p.createSlider(0, innerHeight, innerHeight * 0.67, 1);
      // posP1 = p.createSlider(0, 2, 1, 0.01);

      function flipPlayer(a: SpriteAnimation) {
         a.mirrorX();
      }
      let psOpVal = -0.2;
      let alpha = 0;

      console.log(p);

      function drawMenuUI() {
         if (btnPressStart.textSize < 60) {
            psOpVal *= -1;
         } else if (btnPressStart.textSize > 70) {
            psOpVal *= -1;
         }
         if (alpha < 1) {
            alpha += 0.05;
         }
         btnPressStart.textSize += psOpVal;
         p.push();
         // black background
         p.colorMode('hsl');
         p.fill(0, 0, 0, alpha);
         p.rect(0, 0, innerWidth, innerHeight);
         gfAnim.position.set(centerX * 1.5, centerY * 0.9);
         gfAnim.frameDelay = 60;

         p.imageMode(p.CENTER);
         p.image(
            logo,
            centerX * 0.5,
            centerY * 0.8,
            logo.width * 0.6,
            logo.height * 0.6
         );
         gfAnim.scale = 0.8;
         btnPressStart.draw();
         gfAnim.draw();
         p.pop();

         if (mouse.isDown) {
            mode = '';
            setTimeout(() => {
               mode = 'select';
            }, 500);
            alpha = 0;
         }
      }

      function drawSelectUI() {
         if (alpha < 1) {
            alpha += 0.05;
         }
         p.push();
         p.colorMode('hsl', 360, 100, 100, 1);
         p.fill(49, 99, 54, alpha);
         p.rect(0, 0, innerWidth, innerHeight);
         btnReturnMenu.update();
         btnReturnMenu.draw();
         p.pop();
      }

      p.preload = () => {
         gfAnim.image = p.loadImage('/assets/sprites/' + gf + '.png');
         p.loadJSON('/assets/sprites/' + gf + '.json', (ar) => {
            gfAnim.originalFrames = ar;
            ['cheer', 'dancingbeat', 'fear', 'sad'].forEach((v) => {
               gfAnim.addAnimation(v, (b) => {
                  let res = filterFramesRegExp(b, new RegExp(v + '_', 'i'));
                  if (res.length < 3) {
                     return res;
                  }
                  gfAnim.changeAnimation('dancingbeat');
                  // return res.filter((e, i) => i % 4 === 0);
                  return [res[0], res[Math.floor(res.length * 0.65)]];
               });
            });
            gfAnim.changeAnimation('dancingbeat');
         });
         gfAnim.scale = 1;
      };

      function loadSongData() {
         let songURL = '/assets/musix/' + name;
         audio.inst = p.createAudio(songURL + '/Inst.ogg');
         audio.voice = p.createAudio(songURL + '/Voices.ogg');

         bgImg = p.loadImage('/assets/bg/night_city.jpg');

         startFx[0] = p.loadSound('/assets/fx/intro3.ogg');
         startFx[1] = p.loadSound('/assets/fx/intro2.ogg');
         startFx[2] = p.loadSound('/assets/fx/intro1.ogg');
         startFx[3] = p.loadSound('/assets/fx/introGo.ogg');

         p.loadJSON('/assets/data/' + name + '/default.json', (obj) => {
            audio.song = obj.song as SongData;
            loadCues();
         });
         anim.image = p.loadImage('/assets/sprites/' + char + '.png');
         anim2.image = p.loadImage('/assets/sprites/' + char2 + '.png');

         p.loadJSON('/assets/sprites/' + char + '.json', (ar) => {
            anim.originalFrames = ar;
            arrows.forEach((e) => {
               anim.addAnimation(e, (b, i) => {
                  // console.log(b)
                  let clean = Array.from(b).filter(
                     (v) => !v.name.match(/alt|miss|shaking|mad/i)
                  );
                  let res = clean.filter((v) =>
                     v.name.match(new RegExp(e, 'i'))
                  );
                  // if (e !== 'idle') {
                  //    res = res.filter(v => v.name.match(/_2/i))
                  // }
                  // return res.filter((e, i) => i % 4 === 0);
                  return [res[0], res[Math.floor(res.length * 0.65)]];
               });
            });
         });
         p.loadJSON('/assets/sprites/' + char2 + '.json', (ar) => {
            anim2.originalFrames = ar;
            arrows.forEach((e) => {
               anim2.addAnimation(e, (b, i) => {
                  // console.log(b)
                  let clean = Array.from(b).filter(
                     (v) => !v.name.match(/alt|miss|shaking|mad/i)
                  );
                  let res = clean.filter((v) =>
                     v.name.match(new RegExp(e, 'i'))
                  );
                  // if (e !== 'idle') {
                  //    res = res.filter(v => v.name.match(/_2/i))
                  // }
                  // return res.filter((e, i) => i % 4 === 0);
                  return [res[0], res[Math.floor(res.length * 0.65)]];
               });
            });
         });
      }

      let prevTime;
      let prevTime2;
      let prevTime3;
      let prevTime4;
      function loadCues() {
         startFx[0].onended(() => startFx[1].play());
         startFx[1].onended(() => startFx[2].play());
         startFx[2].onended(() => startFx[3].play());
         startFx[3].onended(() => {
            audio.playing = true;
            audio.inst?.play();
            audio.voice?.play();
         });
         let del = 200;
         audio.song?.notes?.forEach((e) => {
            let hit = e.mustHitSection;
            e.sectionNotes.forEach((v) => {
               let [start, key, hold] = v;
               let cueHit = start / 1000;
               // console.log(cueHit);
               cueHit -= 0.26;
               // console.log(v[0] / 1000)
               if (!hit) {
                  audio.inst?.addCue(cueHit, () => {
                     window.clearTimeout(prevTime);
                     let index = key;
                     let currentImg = 'idle';
                     if (index > 3) {
                        index -= 4;
                     }
                     currentImg = arrows[index] as any;
                     anim.changeAnimation(currentImg);
                     prevTime = window.setTimeout(() => {
                        currentImg = 'idle';
                        anim.changeAnimation(currentImg);
                     }, hold + del);
                  });
                  if (key > 3) {
                     audio.inst?.addCue(cueHit, () => {
                        window.clearTimeout(prevTime2);
                        let index = key;
                        let currentImg = 'idle';
                        if (index > 3) {
                           index -= 4;
                        }
                        currentImg = arrows[index] as any;
                        anim2.frameDelay = 1;
                        anim2.changeAnimation(currentImg);
                        prevTime2 = window.setTimeout(() => {
                           currentImg = 'idle';
                           anim2.changeAnimation(currentImg);
                        }, hold + del);
                     });
                  }
               } else {
                  audio.inst?.addCue(cueHit, () => {
                     console.log(arrows[key]);
                     window.clearTimeout(prevTime3);
                     let index = key;
                     let currentImg = 'idle';
                     if (index > 3) {
                        index -= 4;
                     }
                     currentImg = arrows[index] as any;
                     anim2.changeAnimation(currentImg);
                     prevTime3 = window.setTimeout(() => {
                        currentImg = 'idle';
                        anim2.changeAnimation(currentImg);
                     }, hold + del);
                  });
                  if (key > 3) {
                     audio.inst?.addCue(cueHit, () => {
                        window.clearTimeout(prevTime4);
                        let index = key;
                        let currentImg = 'idle';
                        if (index > 3) {
                           index -= 4;
                        }
                        currentImg = arrows[index] as any;
                        anim.changeAnimation(currentImg);
                        prevTime4 = window.setTimeout(() => {
                           currentImg = 'idle';
                           anim.changeAnimation(currentImg);
                        }, hold + del);
                     });
                  }
               }
            });
         });
      }

      function setupFight() {
         sizeP1.value(scale);
         sizeP1.mouseMoved(() => {
            anim.scale = sizeP1.value() as number;
            anim2.scale = sizeP1.value() as number;
         });
         // posP1.mouseMoved(() => {
         //    anim2.position.y = centerY * (posP1.value() as number);
         // });
         posP2.mouseMoved(() => {
            anim.position.y = posP2.value() as number;
            let anim2Height = anim.position.y;
            anim2Height += anim.getHeight() / 2;
            anim2Height -= anim2.getHeight() / 2;
            anim2.position.set(innerWidth * 0.75, anim2Height);
         });
         // volume.style('position:fixed');
         // toggleButton.style('position:fixed');
         toggleButton.mouseClicked(() => {
            if (audio.playing) {
               audio.playing = false;
               audio.inst?.stop();
               audio.voice?.stop();
               _.invokeMap(startFx, 'stop');
               // cues.forEach(audio.inst?.removeCue as any);
               anim.changeAnimation('idle');
               anim2.changeAnimation('idle');
            } else {
               startFx[0].play();
               // audio.inst?.volume(0)
               // audio.voice?.volume(0)
            }
         });
         volume.mouseMoved(() => {
            _.invokeMap(startFx, 'setVolume', volume.value());
            audio.inst?.volume(volume.value());
            audio.voice?.volume(volume.value());
         });

         flipP1.mouseClicked(() => {
            flipPlayer(anim2);
         });

         flipP2.mouseClicked(() => {
            flipPlayer(anim);
         });

         // anim.mirrorX(true)
         anim.scale = scale;
         anim.frameDelay = 2;
         let animHeight = innerHeight * 0.68;
         animHeight -= anim.getHeight() / 2;
         anim.position.set(innerWidth * 0.25, animHeight);
         anim.changeAnimation('idle');

         // anim2.mirrorX(true)
         anim2.scale = scale2;
         anim2.frameDelay = 2;
         let anim2Height = anim.position.y;
         anim2Height += anim.getHeight() / 2;
         anim2Height -= anim2.getHeight() / 2;
         anim2.position.set(innerWidth * 0.75, anim2Height);

         console.log(anim.getHeight());

         anim2.changeAnimation('idle');

         gfAnim.scale = 0.37;
         gfAnim.frameDelay = delay;
         gfAnim.position.set(centerX, centerY * 1.2);
         gfAnim.changeAnimation('dancingbeat');
         // console.log(gfAnim);
         // bgImg.resize(0, innerHeight);
      }

      p.setup = () => {
         p.createCanvas(innerWidth, innerHeight);
         p.frameRate(60);

         // p.noLoop();
      };
      p.keyPressed = () => {
         if (mode === 'fight') {
            delay = Math.floor(fps / ((audio.song.bpm || 130) / 60)) * 2;
            if (p.keyCode === p.UP_ARROW) {
               anim2.changeAnimation('up');
            }
            if (p.keyCode === p.DOWN_ARROW) {
               anim2.changeAnimation('down');
            }
            if (p.keyCode === p.LEFT_ARROW) {
               anim2.changeAnimation('left');
            }
            if (p.keyCode === p.RIGHT_ARROW) {
               anim2.changeAnimation('right');
            }
         }
         // console.log(anim);
      };

      p.windowResized = () => {
         p.resizeCanvas(p.windowWidth, p.windowHeight);
         centerX = p.windowWidth / 2;
         centerY = p.windowHeight / 2;
         // bgImg.resize(0, innerHeight);
         // gfAnim.position.set(centerX, centerY * 1.2);
         // (p.camera as any as Camera).position.x = centerX;
         // (p.camera as any as Camera).position.y = centerY;
      };

      p.keyReleased = () => {
         if (!p.keyIsPressed) {
            anim2.changeAnimation('idle');
         }
      };

      function drawMainGame() {
         drawBg();
         gfAnim.draw();
         anim.draw();
         anim2.draw();

         if (anim2.getAnimationLabel() !== 'idle') {
            anim2.frameDelay = 2;
            console.log(anim2.frameDelay);
         } else {
            anim2.frameDelay = delay;
         }

         if (anim.getAnimationLabel() !== 'idle') {
            anim.frameDelay = 2;
         } else {
            anim.frameDelay = delay;
         }

         // if (!audio.playing) {
         //    anim.frameDelay = delay;
         //    anim2.frameDelay = delay;
         // }
      }

      p.draw = () => {
         p.push();
         p.fill(0, 50);
         p.rect(0, 0, innerWidth, innerHeight);
         p.pop();
         if (mode === 'menu') {
            drawMenuUI();
         }
         if (mode === 'select') {
            drawSelectUI();
         }
         if (mode === 'fight') {
         }
      };
   };

   new p5(sketch);
}

let loading = $('#loading-screen');

async function fetchAll() {
   let song: string[];
   let sprites: string[];

   if (
      sessionStorage.getItem('sprites-json') &&
      sessionStorage.getItem('song-json')
   ) {
      song = JSON.parse(sessionStorage.getItem('song-json') as string);
      sprites = JSON.parse(sessionStorage.getItem('sprites-json') as string);
   } else {
      let sp = await fetch('/api/list/sprites');
      let sg = await fetch('/api/list/musix');
      sprites = await sp.json();
      song = await sg.json();

      sprites = _.uniq(sprites.map((e) => e.replace(/\.\w+$/i, '')));

      console.log(sprites);
      console.log(song);

      sessionStorage.setItem('sprites-json', JSON.stringify(sprites));
      sessionStorage.setItem('song-json', JSON.stringify(song));
   }

   console.log('Done');
   return [song, sprites];
}

$('#formMain').addClass(() => 'd-none');
loading.addClass(() => 'd-none');
fetchAll().then((e) => {
   init(e[0], e[1]);
});
