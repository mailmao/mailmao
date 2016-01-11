import { Schema } from 'mongoose'

const Log = new Schema({
  type: String,
  message: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
})

export default Log
