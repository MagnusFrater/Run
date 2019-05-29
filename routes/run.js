'use strict';

const express = require('express');
const router = new express.Router();

router.get('/', function(req, res, next) {
  res.render('run', {
    layout: 'main',
    stylesheets: [
      'global',
      'run',
    ],
    scripts: [
      'external/phaser',
      'run',
    ],
  });
});

module.exports = router;