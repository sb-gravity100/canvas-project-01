const path = require('path');
const { Parser } = require('htmlparser2');
const _ = require('lodash');
const fs = require('fs').promises;
const _fs = require('fs');

var dir = './public/assets/sprites';
var obj = [];
var parser;
var onopentag = (_name, attr) => {
   var temp = {
      frame: {}
   };
   var hasName = _.has(attr, 'name') || _.has(attr, 'n');
   var isW = _.has(attr, 'w');
   var isN = _.has(attr, 'n')
   if (hasName) {
      _.assign(temp.frame, attr);
      temp.name = attr.name || attr.n
      if (isW) {
         temp.frame.width = attr.w;
         temp.frame.height = attr.h;
      }
      // console.log(temp)
      obj.push(temp);
   }
};

async function boot() {
   try {
      var map = [];
      var d;
      var dirs = await fs.readdir(dir, 'utf8');
      dirs.forEach((r, i) => {
         if (path.extname(r) === '.xml') {
            console.log(r);
            parser = new Parser({
               onend() {
                  map.push(
                     fs.writeFile(
                        path.join(dir, r.replace(/\.xml$/, '.json')),
                        JSON.stringify(obj),
                        'utf8'
                     )
                  );
                  obj = [];
               },
               onopentag,
            });
            d = readFileSync(path.join(dir, r), 'utf8');
            parser.write(d);
            parser.end();
         }
      });

      await Promise.all(map);
      console.log('Done');
   } catch (e) {
      console.log(e);
   }
}

boot();
