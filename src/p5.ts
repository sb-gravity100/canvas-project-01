import { Element, Image, SoundFile } from 'p5';
import { SpriteAnimation } from './Objects';

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

export function init(
   name = 'zavodila',
   char2 = 'BOYFRIEND',
   char = 'ruv_sheet',
   gf = 'DDLCGF_ass_sets'
) {
   let sketch = (p: p5) => {
      let centerX = p.windowWidth / 2;
      let centerY = p.windowHeight / 2;
      let ts = performance.now() / 1000;
      let fps = Math.floor(p.frameCount / ts);

      let anim = new SpriteAnimation(p);
      let anim2 = new SpriteAnimation(p);
      let bgImg: Image;

      function drawBg() {
         p.clear();
         ts = performance.now() / 1000;
         fps = Math.floor(p.frameCount / ts);
         // camera
         // p.push()
         // p.translate(centerX, centerY)
         // p.imageMode('center')
         // p.image(bgImg, 0, 0)
         // p.pop()
      }
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
      let scale = 0.5;
      let scale2 = 0.5;
      let delay = 25;
      let gfAnim = new SpriteAnimation(p);

      function flipPlayer(a: SpriteAnimation) {
         a.mirrorX();
      }

      function loadSongData() {
         let songURL = '/assets/musix/' + name;
         audio.inst = p.createAudio(songURL + '/Inst.ogg');
         audio.voice = p.createAudio(songURL + '/Voices.ogg');

         bgImg = p.loadImage('/assets/base.png');

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
         gfAnim.image = p.loadImage('/assets/sprites/' + gf + '.png');
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
      }

      p.preload = () => {
         loadSongData();
      };

      // function addAnimationOnCue(anim: SpriteAnimation, notes: number[]) {
      //    let [start, key, hold] = notes
      // }

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
         let del = 50;
         audio.song?.notes?.forEach((e) => {
            let hit = e.mustHitSection;
            e.sectionNotes.forEach((v) => {
               let [start, key, hold] = v;
               let cueHit = start / 1000;
               console.log(cueHit);
               cueHit -= 0.26;
               // console.log(v[0] / 1000)
               if (!hit) {
                  audio.inst?.addCue(cueHit, () => {
                     let index = key;
                     let currentImg = 'idle';
                     if (index > 3) {
                        index -= 4;
                     }
                     currentImg = arrows[index] as any;
                     anim.changeAnimation(currentImg);
                     audio.inst?.addCue(cueHit + hold, () => {
                        currentImg = 'idle';
                        anim.changeAnimation(currentImg);
                     });
                  });
                  if (key > 3) {
                     audio.inst?.addCue(cueHit, () => {
                        let index = key;
                        let currentImg = 'idle';
                        if (index > 3) {
                           index -= 4;
                        }
                        currentImg = arrows[index] as any;
                        anim2.frameDelay = 1;
                        anim2.changeAnimation(currentImg);
                        audio.inst?.addCue(cueHit + hold, () => {
                           currentImg = 'idle';
                           anim2.changeAnimation(currentImg);
                        });
                     });
                  }
               } else {
                  audio.inst?.addCue(cueHit, () => {
                     let index = key;
                     let currentImg = 'idle';
                     if (index > 3) {
                        index -= 4;
                     }
                     currentImg = arrows[index] as any;
                     anim2.changeAnimation(currentImg);
                     audio.inst?.addCue(cueHit + hold, () => {
                        currentImg = 'idle';
                        anim2.changeAnimation(currentImg);
                     });
                  });
                  if (key > 3) {
                     audio.inst?.addCue(cueHit, () => {
                        let index = key;
                        let currentImg = 'idle';
                        if (index > 3) {
                           index -= 4;
                        }
                        currentImg = arrows[index] as any;
                        anim.changeAnimation(currentImg);
                        audio.inst?.addCue(cueHit + hold, () => {
                           currentImg = 'idle';
                           anim.changeAnimation(currentImg);
                        });
                     });
                  }
               }
            });
         });
      }

      p.setup = () => {
         p.createCanvas(p.windowWidth, p.windowHeight);
         let animHalfHeight = anim.getHeight() / 2;
         let anim2HalfHeight = anim2.getHeight() / 2;
         // p.noLoop();
         toggleButton = p.createButton('Toggle');
         flipP1 = p.createButton('Flip Player1');
         flipP2 = p.createButton('Flip Player2');
         volume = p.createSlider(0, 1, 0.1, 0.01);
         sizeP2 = p.createSlider(0, 1, 0, 0.01);
         sizeP1 = p.createSlider(0, 1, 0, 0.01);
         sizeP1.value(scale);
         sizeP2.value(scale2);
         posP2 = p.createSlider(0, 2, 1, 0.01);
         posP1 = p.createSlider(0, 2, 1, 0.01);
         sizeP1.mouseMoved(() => {
            anim2.scale = sizeP1.value() as number;
         });
         sizeP2.mouseMoved(() => {
            anim.scale = sizeP2.value() as number;
         });
         posP1.mouseMoved(() => {
            anim2.position.y = centerY * (posP1.value() as number);
         });
         posP2.mouseMoved(() => {
            anim.position.y = centerY * (posP2.value() as number);
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
         anim.position.set(innerWidth * 0.25, centerY - animHalfHeight);
         anim.changeAnimation('idle');
         console.log(anim);

         // anim2.mirrorX(true)
         anim2.scale = scale2;
         anim2.frameDelay = 2;
         anim2.position.set(innerWidth * 0.75, centerY - anim2HalfHeight);
         anim2.changeAnimation('idle');
         console.log(anim2);

         gfAnim.scale = 0.4;
         gfAnim.frameDelay = delay;
         gfAnim.position.set(centerX, centerY * 1.2);
         gfAnim.changeAnimation('dancingbeat');
         // console.log(gfAnim);
         bgImg.resize(0, innerHeight);
      };
      p.keyPressed = () => {
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
         // console.log(anim);
      };

      p.windowResized = () => {
         p.resizeCanvas(p.windowWidth, p.windowHeight);
         centerX = p.windowWidth / 2;
         centerY = p.windowHeight / 2;
         bgImg.resize(0, innerHeight);
         // (p.camera as any as Camera).position.x = centerX;
         // (p.camera as any as Camera).position.y = centerY;
      };

      p.keyReleased = () => {
         if (!p.keyIsPressed) {
            anim2.changeAnimation('idle');
         }
      };

      p.draw = () => {
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
      };
   };

   new p5(sketch);
}

let p1 = $('select#p1Select') as JQuery<HTMLSelectElement>;
let p2 = $('select#p2Select') as JQuery<HTMLSelectElement>;
let gfSel = $('select#gfSelect') as JQuery<HTMLSelectElement>;
let songSelect = $('select#songSelect') as JQuery<HTMLSelectElement>;
let loading = $('#loading-screen');
let params = new URLSearchParams(location.search.slice(1));

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

   sprites.forEach((v) => {
      let el = `<option value="${v}">${v}</option>`;
      p1.append(el);
      p2.append(el);
      if (v.match(/gf/i)) {
         gfSel.append(el);
      }
   });

   song.forEach((v) => {
      let el = `<option value="${v}">${v}</option>`;
      songSelect.append(el);
   });

   loading.addClass(() => 'd-none');
}

if (
   params.has('player1') &&
   params.has('player2') &&
   params.has('song') &&
   params.has('gf')
) {
   $('#formMain').addClass(() => 'd-none');
   loading.addClass(() => 'd-none');
   init(
      params.get('song') as string,
      params.get('player1') as string,
      params.get('player2') as string,
      params.get('gf') as string
   );
} else {
   fetchAll();
}
