'use strict';

const express = require('express');
const router = new express.Router();
const serveStatic = require('serve-static');
const path = require('path');

// all other static resources
router.use('/static', serveStatic(path.join(__dirname, '../static')));

// site routes
const run = require('./run');
const four04 = require('./404');

router.use('/', run);
router.use(four04);

module.exports = router;
