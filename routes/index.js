// Global dependencies
import express from 'express'
import multer from 'multer'
import Debug from 'debug'

// routes
const routes = [
  'landing',
  'group',
  'member',
  'mail',
]

const debug = Debug('mailmao:route:index')
const upload = multer({ 
  dest: 'uploads/'
})

export default function(app, models) {  
  const API_VERSION = 'v2'
  const deps = {
    app,
    express,
    upload,
  }

  // Inject models dep
  Object.keys(models).forEach(item =>
    deps[item] = models[item])

  // Init routers
  const routers = initRoutes(routes, deps)

  routes.forEach(route => {
    // Pages
    if (route === 'landing')
      return app.use('/', routers.landing)

    // APIs
    app.use(`/api/${API_VERSION}/${route}`, auth, routers[route])
  })

  function auth(req, res, next) {
    if (!req.session.uid)
      return next(new Error(401))

    debug(req.session.uid)

    return next()
  }
}

function initRoutes(routes, deps) {
  var ret = {}
  routes.forEach(route => {
    ret[route] = require(`./${ route }`)(deps)
  })
  return ret
}
