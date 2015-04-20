var sign = require('./routes/sign')

module.exports = routes;

function routes(app) {
  // Home Page
  app.get('/', sign.passport, require('./home'));

  // Sign in and Sign out
  app.get('/signin', sign.signin);
  app.get('/signout', sign.signout);

  // Dynamic Pages
  app.get('/sync', sign.check, require('./duoshuo'));
  app.get('/trello', sign.check, require('./trello'));
  app.get('/mime', sign.check, require('mime').home);
  app.get('/mime/update', sign.check, require('mime').update);

  // Static Pages
  app.get('/about', sign.passport, require('./about'));

  // APIs
  app.post('/update', sign.checkJSON, apis.update);
  app.post('/send', sign.checkJSON, apis.send);
  app.post('/upload', sign.checkJSON, apis.upload);
  app.post('/sync', sign.check, duoshuo.sync);
  app.post('/mime/update', sign.checkJSON, apis.setting);
  app.post('/mime/update/token', sign.checkJSON, apis.token);
}
