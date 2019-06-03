'use strict';

const express = require('express');
const router = new express.Router();

const serveStatic = require('serve-static');
const path = require('path');

// Phaser 3
router.use('/scripts/external/pixi.js', serveStatic(path.join(
  __dirname,
  '../node_modules/pixi.js/dist/pixi.min.js'
)));

// all other static resources
router.use(serveStatic(path.join(__dirname, '../static')));

module.exports = router;
