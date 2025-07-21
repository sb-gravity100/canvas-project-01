import express from 'express';
import fs from 'fs';
import path from 'path';

var assets = '../public/assets';
var route = express.Router();
export default route;

route.get('/list/musix', (req, res, next) => {
   fs.readdir(
      path.join(assets, 'musix'),
      { withFileTypes: true },
      (err, files) => {
         if (err) next(err);
         var mapped = files.filter((e) => e.isDirectory()).map((e) => e.name);
         res.json(mapped);
      }
   );
});

route.get('/list/data', (req, res, next) => {
   fs.readdir(
      path.join(assets, 'data'),
      { withFileTypes: true },
      (err, files) => {
         if (err) next(err);
         var mapped = files.filter((e) => e.isDirectory()).map((e) => e.name);
         res.json(mapped);
      }
   );
});

route.get('/list/sprites', (req, res, next) => {
   fs.readdir(
      path.join(assets, 'sprites'),
      { withFileTypes: true },
      (err, files) => {
         if (err) next(err);
         var mapped = files.filter((e) => !e.isDirectory()).map((e) => e.name);
         res.json(mapped);
      }
   );
});
