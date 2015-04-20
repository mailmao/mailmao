var Server = require('./libs/server');
var routes = require('./routes/index');

new Server()
  .routes(routes)
  .run();