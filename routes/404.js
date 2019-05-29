'use strict';

const express = require('express');
const router = new express.Router();

router.use(function(req, res, next) {
  res.status(404).render('404', {
    layout: 'main',
    stylesheets: [
      'global',
      '404',
    ],
    scripts: [
      '404',
    ],
  });
});

module.exports = router;
