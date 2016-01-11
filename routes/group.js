import Debug from 'debug'

const debug = Debug('mailmao:route:group')

export default function({ app, express, Group, Member }) {
  var Route = express.Router()

  // Homepage
  Route.post('/', createOne)
  Route.get('/:id', findOne)
  Route.post('/:id', updateOne)
  Route.delete('/:id', removeOne)

  return Route

  function createOne(req, res, next) {

  }

  function findOne(req, res, next) {

  }

  function updateOne(req, res, next) {

  }

  function removeOne(req, res, next) {
    
  }
}