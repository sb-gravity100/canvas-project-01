"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var path_1 = require("path");
var assets = '../public/assets';
var route = express_1.default.Router();
exports.default = route;
route.get('/list/musix', function (req, res, next) {
    fs_1.default.readdir(path_1.default.join(assets, 'musix'), { withFileTypes: true }, function (err, files) {
        if (err)
            next(err);
        var mapped = files.filter(function (e) { return e.isDirectory(); }).map(function (e) { return e.name; });
        res.json(mapped);
    });
});
route.get('/list/data', function (req, res, next) {
    fs_1.default.readdir(path_1.default.join(assets, 'data'), { withFileTypes: true }, function (err, files) {
        if (err)
            next(err);
        var mapped = files.filter(function (e) { return e.isDirectory(); }).map(function (e) { return e.name; });
        res.json(mapped);
    });
});
route.get('/list/sprites', function (req, res, next) {
    fs_1.default.readdir(path_1.default.join(assets, 'sprites'), { withFileTypes: true }, function (err, files) {
        if (err)
            next(err);
        var mapped = files.filter(function (e) { return !e.isDirectory(); }).map(function (e) { return e.name; });
        res.json(mapped);
    });
});
route.get('/list/bg', function (req, res, next) {
    fs_1.default.readdir(path_1.default.join(assets, 'bg'), { withFileTypes: true }, function (err, files) {
        if (err)
            next(err);
        var mapped = files.filter(function (e) { return !e.isDirectory(); }).map(function (e) { return e.name; });
        res.json(mapped);
    });
});
