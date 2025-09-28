import { Element, Image, SoundFile } from 'p5';
import { SpriteAnimation, UIButton, UIImage, UIText } from './Objects';
import { mouse } from './context';
import _gsap from 'gsap/gsap-core';
import { sortedUniqBy } from 'lodash';

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

export function init(song, sprite, bglist) {
   console.log(song, sprite);
   let sketch = (p: p5) => {
      let centerX = p.windowWidth / 2;
      let centerY = p.windowHeight / 2;
      let ts = performance.now() / 1000;
      let fps = Math.floor(p.frameCount / ts);
      let fnfFont = p.loadFont('/assets/FridayNightFunkin-Regular.ttf');

      let name = 'zavodila',
         char2 = 'BOYFRIEND',
         char = 'ruv_sheet',
         gf = 'GF_assets';

      let anim = new SpriteAnimation(p);
      let anim2 = new SpriteAnimation(p);
      let bgImg: Image;
      let notesImg: Image;
      let notesList: SpriteFrame[] = [];
      let selectArrows = {} as any;
      let charSelection: SpriteAnimation[] = [];
      let audioSelection: string[] = song;
      let audioList: SoundFile[][] = [];
      let bgList: Image[] = [];
      let currentAudio = 0;
      let currentChar = 6;
      let currentBg = 0;

      p.preload = () => {
         bglist.forEach((e) => {
            p.loadImage('/assets/bg/' + e, (r) => {
               bgList.push(r);
            });
         });
         song.forEach((e: string) => {
            const inst = p.loadSound('/assets/musix/' + e + '/Inst.ogg');
            const voc = p.loadSound('/assets/musix/' + e + '/Voices.ogg');
            audioList.push([inst, voc]);
         });
         sprite
            .filter(
               (e) =>
                  !e.match(
                     /big_monikia_death|bf|gf|funsize|playable|boyfriend|NOTE|narancia|giorno|monika_finale|nokiaPhoneCall|pegmeplease|theseknees/i
                  )
            )
            .forEach((e: string) => {
               console.log(e);
               let sa = new SpriteAnimation(p);
               sa.image = p.loadImage('/assets/sprites/' + e + '.png');
               p.loadJSON('/assets/sprites/' + e + '.json', (ar) => {
                  sa.originalFrames = ar;
                  sa.addAnimation('idle', (b) =>
                     filterFramesRegExp(b, /idle/i)
                  );
                  sa.addAnimation('left', (b) =>
                     filterFramesRegExp(b, /left/i)
                  );
                  sa.addAnimation('down', (b) =>
                     filterFramesRegExp(b, /down/i)
                  );
                  sa.addAnimation('up', (b) => filterFramesRegExp(b, /up/i));
                  sa.addAnimation('right', (b) =>
                     filterFramesRegExp(b, /right/i)
                  );
                  sa.changeAnimation('idle');
                  sa.scale = 0.4;
                  sa.position.set(innerWidth * 0.1, innerHeight * 0.5);
                  sa.frameDelay = 8;
                  charSelection.push(sa);
               });
            });
         gfAnim.image = p.loadImage('/assets/sprites/' + gf + '.png', (e) => {
            loading.addClass(() => 'd-none');
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

         p.loadJSON('/assets/sprites/NOTE_Assets.json', (ar) => {
            notesList = ar;

            let up = _.find(notesList, (e) => e.name === 'ArrowUp0000');
            let down = _.find(notesList, (e) => e.name === 'ArrowDown0000');
            let left = _.find(notesList, (e) => e.name === 'ArrowLeft0000');
            let right = _.find(notesList, (e) => e.name === 'ArrowRight0000');

            notesImg = p.loadImage('/assets/sprites/NOTE_Assets.png', () => {
               selectArrows.up = new UIImage(
                  p,
                  p.createVector(up?.frame.width, up?.frame.height),
                  p.createVector(innerWidth * 0.1, innerHeight * 0.1)
               );
               selectArrows.down = new UIImage(
                  p,
                  p.createVector(down?.frame.width, down?.frame.height),
                  p.createVector(innerWidth * 0.1, innerHeight * 0.9)
               );
               selectArrows.left = new UIImage(
                  p,
                  p.createVector(left?.frame.width, left?.frame.height),
                  p.createVector(innerWidth * 0.5, innerHeight * 0.15)
               );
               selectArrows.right = new UIImage(
                  p,
                  p.createVector(right?.frame.width, right?.frame.height),
                  p.createVector(innerWidth * 0.9, innerHeight * 0.15)
               );
               selectArrows.left2 = new UIImage(
                  p,
                  p.createVector(left?.frame.width, left?.frame.height),
                  p.createVector(innerWidth * 0.5, innerHeight * 0.6)
               );
               selectArrows.right2 = new UIImage(
                  p,
                  p.createVector(right?.frame.width, right?.frame.height),
                  p.createVector(innerWidth * 0.9, innerHeight * 0.6)
               );

               selectArrows.up.image = notesImg.get(
                  up?.frame.x || 0,
                  up?.frame.y || 0,
                  up?.frame.width || 0,
                  up?.frame.height || 0
               );
               selectArrows.down.image = notesImg.get(
                  down?.frame.x || 0,
                  down?.frame.y || 0,
                  down?.frame.width || 0,
                  down?.frame.height || 0
               );
               selectArrows.left.image = notesImg.get(
                  left?.frame.x || 0,
                  left?.frame.y || 0,
                  left?.frame.width || 0,
                  left?.frame.height || 0
               );
               selectArrows.right.image = notesImg.get(
                  right?.frame.x || 0,
                  right?.frame.y || 0,
                  right?.frame.width || 0,
                  right?.frame.height || 0
               );
               selectArrows.left2.image = notesImg.get(
                  left?.frame.x || 0,
                  left?.frame.y || 0,
                  left?.frame.width || 0,
                  left?.frame.height || 0
               );
               selectArrows.right2.image = notesImg.get(
                  right?.frame.x || 0,
                  right?.frame.y || 0,
                  right?.frame.width || 0,
                  right?.frame.height || 0
               );
               selectArrows.up.scale = 0.8;
               selectArrows.down.scale = 0.8;
               selectArrows.left.scale = 0.8;
               selectArrows.right.scale = 0.8;
               selectArrows.left2.scale = 0.8;
               selectArrows.right2.scale = 0.8;
               console.log(selectArrows);

               selectArrows.up.onClick = () => {
                  currentChar--;
                  if (currentChar < 0) {
                     currentChar = charSelection.length - 1;
                  }
                  console.log(charSelection[currentChar]);
               };
               selectArrows.down.onClick = () => {
                  currentChar++;
                  if (currentChar > charSelection.length - 1) {
                     currentChar = 0;
                  }
                  console.log(charSelection[currentChar]);
               };
               selectArrows.left.onClick = () => {
                  audioList[currentAudio][0].stop(2);
                  audioList[currentAudio][1].stop(2);
                  currentAudio--;
                  if (currentAudio < 0) {
                     currentAudio = audioSelection.length - 1;
                  }
                  audioList[currentAudio][0].play(2);
                  audioList[currentAudio][1].play(2);
               };
               selectArrows.right.onClick = () => {
                  audioList[currentAudio][0].stop(2);
                  audioList[currentAudio][1].stop(2);
                  currentAudio++;
                  if (currentAudio > audioSelection.length - 1) {
                     currentAudio = 0;
                  }
                  audioList[currentAudio][0].play(2);
                  audioList[currentAudio][1].play(2);
               };
               selectArrows.left2.onClick = () => {
                  currentBg--;
                  if (currentBg < 0) {
                     currentBg = bgList.length - 1;
                  }
               };
               selectArrows.right2.onClick = () => {
                  currentBg++;
                  if (currentBg > bgList.length - 1) {
                     currentBg = 0;
                  }
               };
            });

            console.log(up, down);
         });

         startFx[0] = p.loadSound('/assets/fx/intro3.ogg');
         startFx[1] = p.loadSound('/assets/fx/intro2.ogg');
         startFx[2] = p.loadSound('/assets/fx/intro1.ogg');
         startFx[3] = p.loadSound('/assets/fx/introGo.ogg');
      };

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
         p.createVector(innerWidth * 0.95, innerHeight * 0.9),
         'Back'
      );
      let btnStart = new UIButton(
         p,
         p.createVector(300, 100),
         p.createVector(centerX, centerY * 1.8),
         'Start'
      );
      let audioTextSelect = new UIText(
         p,
         p.createVector(innerWidth * 0.7, innerHeight * 0.15),
         audioSelection[currentAudio]
      );
      let bgSelect = new UIImage(
         p,
         p.createVector(400, 200),
         p.createVector(innerWidth * 0.7, innerHeight * 0.6)
      );

      audioTextSelect.textSize = 50;
      audioTextSelect.textFont = fnfFont;
      audioTextSelect.textColor = 'white';
      audioTextSelect.textBorderColor = 'black';
      audioTextSelect.textBorderWidth = 7;

      btnPressStart.textSize = 60;
      btnPressStart.textFont = fnfFont;
      btnPressStart.textColor = 'white';
      btnPressStart.textBorderColor = 'black';
      btnPressStart.textBorderWidth = 4;
      btnPressStart.onClick = () => {
         anim = charSelection[currentChar];
         audio.inst = audioList[0];
      };

      btnReturnMenu.textSize = 35;
      btnReturnMenu.textColor = 'white';
      btnReturnMenu.textFont = fnfFont;
      btnReturnMenu.backgroundColor = '#284b63';
      btnReturnMenu.borderRadius = 5;
      btnReturnMenu.hoverBackgroundColor = '#153243';
      btnReturnMenu.onClick = () => {
         mode = '';
         audioList[currentAudio][0].stop();
         audioList[currentAudio][1].stop();
         setTimeout(() => {
            mode = 'menu';
         }, 500);
         alpha = 0;
      };
      // btnReturnMenu.hoverBackgroundColor =

      btnStart.textSize = 60;
      btnStart.textColor = 'white';
      btnStart.textFont = fnfFont;
      btnStart.backgroundColor = 'magenta';
      btnStart.borderRadius = 50;
      btnStart.borderWidth = 10;
      btnStart.hoverBackgroundColor = '#aa00aa';
      btnStart.hoverTextColor = 'white';
      btnStart.onClick = () => {};

      toggleButton = p.createButton('Toggle');
      flipP1 = p.createButton('Flip Player1');
      flipP2 = p.createButton('Flip Player2');
      volume = p.createSlider(0, 1, 0.1, 0.01);
      sizeP1 = p.createSlider(0, 1, 0, 0.01);

      sizeP1.hide();
      // sizeP2.hide()
      flipP1.hide();
      flipP2.hide();
      // posP1.hide()
      // posP2.hide()
      toggleButton.hide();
      volume.hide();

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

         if (p.mouseIsPressed) {
            mode = '';
            setTimeout(() => {
               mode = 'select';
               setTimeout(() => {
                  audioList[currentAudio][0].play(2);
                  audioList[currentAudio][1].play(2);
               }, 1500);
            }, 500);
            alpha = 0;
         }
      }

      let tsgVal = 0.1;
      function drawSelectUI() {
         if (alpha < 1) {
            alpha += 0.05;
         }
         if (audioTextSelect.textSize > 60) {
            tsgVal *= -1;
         } else if (audioTextSelect.textSize < 50) {
            tsgVal *= -1;
         }
         audioTextSelect.textSize += tsgVal;
         p.push();
         p.colorMode('hsl', 360, 100, 100, 1);
         p.fill(49, 99, 54, alpha);
         p.rect(0, 0, innerWidth, innerHeight);
         btnReturnMenu.update();
         btnStart.update();
         btnReturnMenu.draw();
         btnStart.draw();
         for (let k in selectArrows) {
            selectArrows[k].update();
            selectArrows[k].draw();
         }
         audioTextSelect.text = audioSelection[currentAudio]
            .split('-')
            .join(' ');
         audioTextSelect.update();
         audioTextSelect.draw();
         if (charSelection.length > 0) {
            charSelection[currentChar].update();
            charSelection[currentChar].draw();
         }
         bgSelect.image = bgList[currentBg];
         bgSelect.draw();
         p.pop();
      }

      function loadSongData() {
         let songURL = '/assets/musix/' + name;
         audio.inst = p.createAudio(songURL + '/Inst.ogg');
         audio.voice = p.createAudio(songURL + '/Voices.ogg');

         bgImg = p.loadImage('/assets/bg/night_city.jpg');

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
         p.createCanvas(p.windowWidth, p.windowHeight);
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
            drawMainGame();
         }
      };
   };

   new p5(sketch);
}

let loading = $('#loading-screen');

async function fetchAll() {
   let song: string[];
   let sprites: string[];
   let bg: string[];

   if (
      sessionStorage.getItem('sprites-json') &&
      sessionStorage.getItem('song-json') &&
      sessionStorage.getItem('bg-json')
   ) {
      song = JSON.parse(sessionStorage.getItem('song-json') as string);
      sprites = JSON.parse(sessionStorage.getItem('sprites-json') as string);
      bg = JSON.parse(sessionStorage.getItem('bg-json') as string);
   } else {
      let sp = await fetch('/api/list/sprites');
      let sg = await fetch('/api/list/musix');
      let _bg = await fetch('/api/list/bg');
      sprites = await sp.json();
      song = await sg.json();
      bg = await _bg.json();

      sprites = _.uniq(sprites.map((e) => e.replace(/\.\w+$/i, '')));

      console.log(sprites);
      console.log(song);

      sessionStorage.setItem('sprites-json', JSON.stringify(sprites));
      sessionStorage.setItem('song-json', JSON.stringify(song));
      sessionStorage.setItem('bg-json', JSON.stringify(bg));
   }

   console.log('Done');
   return [song, sprites, bg];
}

$('#formMain').addClass(() => 'd-none');
fetchAll().then((e) => {
   init(e[0], e[1], e[2]);
});
