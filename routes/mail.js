import Debug from 'debug'

const debug = Debug('mailmao:route:mail')

export default function({ app, express, Mail, Member }) {
  var Route = express.Router()

  // Homepage
  Route.post('/', createOne)
  Route.get('/:id', findOne)
  Route.post('/:id', sendOne)

  return Route

  function createOne(req, res, next) {
    
  }

  function findOne(req, res, next) {

  }

  function sendOne(req, res, next) {

  }
}