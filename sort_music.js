var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var cwd = './public/assets/musix';
function withCwd(...args) {
   return path.join(cwd, ...args);
}

var dir = fs.readdirSync(cwd).filter(e => /\.ogg$/.test(e));
var folders = dir.map(e => e.replace(/_(inst|voices)\.ogg$/i, ''));

folders = _.uniq(folders);

try {
   folders.forEach(e => fs.mkdirSync(withCwd(e), fs.constants));
} catch (e) {
   if (e.code === 'EEXIST') {
      console.log('Folder', e.path, 'already exist');
   }
}

dir.forEach(e => {
   var c = withCwd(e);
   fs.copyFileSync(
      c,
      withCwd(
         e.replace(/(_(inst|voices))?\.ogg$/i, ''),
         e.split('_')[1] || e.split('_')[0]
      )
   );
});

var folds = fs.readdirSync(cwd, {
   withFileTypes: true,
});

folds.forEach(e => {
   var c = withCwd(e.name);
   var b = withCwd(
      e.name
         .split(/(\s|-)/i)
         .map(_.capitalize)
         .join('-')
         .replace(/[\s-]+/gi, '-')
   );
   fs.renameSync(c, b);
});

dir.forEach(e => {
   fs.unlinkSync(withCwd(e));
});
