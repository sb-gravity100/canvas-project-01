const path = require('path');
const { Parser } = require('htmlparser2');
const _ = require('lodash');
const fs = require('fs').promises;
const { pascalCase } = require('change-case');
 const { readFileSync } = require('fs');

var dir = './public/assets/sprites';
var obj = [];
var options = {
   splitRegexp: /([a-z])([A-Z0-9])/g,
};
var parser;
var onopentag = (_name, attr) => {
   var temp = {
      name: '',
      frame: {
         width: 0,
         height: 0,
      }
   };
   var hasName = _.has(attr, 'name') || _.has(attr, 'n');
   if (hasName) {
      _.assign(temp.frame, attr);
      temp.name = pascalCase(attr.name || attr.n, options)
      temp.frame.width = attr.width || attr.w;
      temp.frame.height = attr.height || attr.w;
      // console.log(temp)
      delete temp.frame.name
      delete temp.frame.w
      delete temp.frame.h
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
