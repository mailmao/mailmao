import Debug from 'debug'

const debug = Debug('mailmao:route:group')

export default function({ app, express, Group, Member }) {
  var Route = express.Router()

  // Homepage
  Route.get('/:id', findOne)
  Route.post('/:id', updateOne)

  return Route

  function findOne(req, res, next) {

  }

  function updateOne(req, res, next) {

  }
}