import Promise from 'bluebird'
import mongoose from 'mongoose'
import { toUpperCase } from '../libs/utils'

// Promisify all APIs
Promise.promisifyAll(mongoose)

export function createModels(db) {
  // Init models
  const models = {}
  const files = [
    'group',
    'mail',
    'member',
    'log'
  ]

  files.forEach(model => {
    module.exports[toUpperCase(model)] = models[toUpperCase(model)] = db.model(model, require(`./${model}`))
  })

  return models
}

export function connect({ uri, options={}}) {
  return Promise.resolve(mongoose.createConnection(uri, options))
}
