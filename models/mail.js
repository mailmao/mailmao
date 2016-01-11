import Debug from 'debug'
import Promise from 'bluebird'
import { Schema } from 'mongoose'

const debug = Debug('mailmao:models:mail')
const Mail = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  member: {
    type: Schema.Types.ObjectId,
    ref: 'member'
  }
})

export default Mail