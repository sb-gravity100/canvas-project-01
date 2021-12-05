var fs = require('fs');
var path = require('path');
const { paramCase } = require('change-case');

var cwd = './public/assets/data';
// cwd =
   // 'D:/Cafe STL/DL/Miscellaneous/fnf/fnfjojo_102nv/Version jojo FNF/assets/data';
var options = {
   splitRegexp: /([a-z])([A-Z0-9])/g,
};
function withCwd(...args) {
   return path.join(cwd, ...args);
}

var folds = fs.readdirSync(cwd, {
   withFileTypes: true,
});
console.log(folds.length)

folds.forEach(e => {
   var c = withCwd(e.name);
   var b = withCwd(paramCase(e.name, options));
   fs.renameSync(c, b);
});

folds = fs.readdirSync(cwd, {
   withFileTypes: true,
}).filter(e => e.isDirectory());

folds.forEach(e => {
   var dir = fs.readdirSync(withCwd(e.name)).filter(e => e.match(/\.json$/i))
   dir.forEach(d => {
      var splitted = d.replace(/\.json$/i, '').split('-')
      var prefix = ''
      if (splitted[splitted.length - 1].match(/(alt|easy|hard)\d*$/i)) {
         prefix = paramCase(splitted[splitted.length - 1])
      }
      var filename = paramCase(`default ${prefix}`) + '.json'
      fs.renameSync(withCwd(e.name, d), withCwd(e.name, filename))
   })
})
