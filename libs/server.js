//                     _ __                    
//    ____ ___  ____ _(_) /___ ___  ____ _____ 
//   / __ `__ \/ __ `/ / / __ `__ \/ __ `/ __ \
//  / / / / / / /_/ / / / / / / / / /_/ / /_/ /
// /_/ /_/ /_/\__,_/_/_/_/ /_/ /_/\__,_/\____/ 
// 
// @author: [turing](http://github.com/guo-yu)
// @description : Weekly reports made easy.

require('babel/register')

// Global dependencies
import path from 'path'
import express from 'express'
import morgan from "morgan"
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import swig from 'swig'

// Local dependencies
import routes from '../routes'
import configs from '../configs.json'
import { connect, createModels } from '../models'

const app = express()
const env = process.env.NODE_ENV || 'development'
const production = (env === 'production')

// Deps setup
if (!production)
  swig.setDefaults({ cache: false })

// Environments
app.set('env', env)
app.set('port', process.env.PORT || 8080)
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))
app.set('view cache', production)

// Middlewares
app.use(morgan(production ? 'common' : 'dev'))
app.use(bodyParser.urlencoded({ extended: false })) // `application/x-www-form-urlencoded`
app.use(bodyParser.json()) // `application/json`
app.use(express.static('public/dist'))

// Locals
app.locals.URI = production ? 
  (configs.URI || 'http://127.0.0.1') :
  `http://127.0.0.1:${ app.get('port') }`;

// Try to connect to db
connect(configs.db)
  .then(db => {
    // Session handler
    let sessionConfig = {
      secret: 's2snr22i(1T?z'
    }

    const mongoStore = connectMongo(session)
    sessionConfig.store = new mongoStore({
      mongooseConnection: db
    })

    // Session middleware
    app.use(session(sessionConfig))

    // Init routes
    routes(app, createModels(db))

    // Errors
    app.use(logErrors)
    app.use(clientErrorHandler)
    app.use(errorHandler)

    // Run 
    app.listen(app.get('port'), () =>
      console.log('Mailmao is running on port:', app.get('port')))

    function logErrors(err, req, res, next) {
      console.error(err.stack)
      next(err)
    }

    function clientErrorHandler(err, req, res, next) {
      if (!req.xhr)
        return next(err)

      res.status(err.message || 500)
      res.json({ 
        code: 99,
        message: {
          '400': 'Auth failed',
          '401': 'Auth failed',
          '500': 'Server Error',
          '403': 'Forbidden'
        }[err.message]
      })
    }

    function errorHandler(err, req, res, next) {
      res.status(500)
      res.render('error', { 
        err 
      })
    }
  })
  .catch(err => {
    throw err
  })
