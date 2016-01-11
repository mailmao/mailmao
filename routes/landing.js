import Debug from 'debug'

const debug = Debug('mailmao:route:home')

export default function({ app, express }) {
  var Route = express.Router()

  // Homepage
  Route.get('/', landing())

  return Route

  function landing(view='landing') {
    return (req, res, next) => {
      return res.render(view)
    }
  }
}