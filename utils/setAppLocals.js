'use strict';

module.exports = (app) => {
  app.locals.projectName = 'Run';
  app.locals.description = 'Remake of my original, first, completed game.';
  app.locals.author = 'Todd Everett Griffin';
  app.locals.url = 'localhost'; // TODO update this
  app.locals.themeColor = '#000000'; // TODO update this
  app.locals.keywords = 'io,game';
};
