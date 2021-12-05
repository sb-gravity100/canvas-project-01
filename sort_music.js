var _ = require('lodash');
var fs = require('fs');
var path = require('path');
const { paramCase } = require('change-case');

var cwd = './public/assets/musix'
// cwd = 'D:/Cafe STL/DL/Miscellaneous/fnf/fnfjojo_102nv/Version jojo FNF/assets/music';
var options = {
   splitRegexp: /([a-z])([A-Z0-9])/g,
};
function withCwd(...args) {
   return path.join(cwd, ...args);
}

var dir = fs.readdirSync(cwd).filter(e => /\.ogg$/.test(e));

console.log(dir.length);

dir.forEach(e => {
   var folderName = paramCase(
      e.replace(/(_(inst|voices))?\.ogg$/i, ''),
      options
   );
   try {
      fs.mkdirSync(withCwd(folderName));
   } catch (e) {
      // if (e.code === 'EEXIST') {
      //    console.log('Folder', e.path, 'already exist');
      // }
   }
   var c = withCwd(e);
   fs.copyFileSync(c, withCwd(folderName, e.split('_')[1] || e.split('_')[0]));
});

var folds = fs.readdirSync(cwd, {
   withFileTypes: true,
}).filter(e => e.isDirectory());
console.log(folds.length);

folds.forEach(e => {
   var c = withCwd(e.name);
   var b = withCwd(paramCase(e.name, options));
   fs.renameSync(c, b);
});

dir.forEach(e => {
   try {
      // fs.unlinkSync(withCwd(e));
   } catch (e) {}
});
