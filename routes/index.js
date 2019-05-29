'use strict';

const express = require('express');
const router = new express.Router();

// static resources
const staticRes = require('./static');
router.use('/static', staticRes);

// site routes
const run = require('./run');
router.use('/', run);

// error
const four04 = require('./404');
router.use(four04);

module.exports = router;
