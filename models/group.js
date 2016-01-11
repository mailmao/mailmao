import Debug from 'debug'
import Promise from 'bluebird'
import { Schema } from 'mongoose'

const debug = Debug('mailmao:models:group')
const Group = new Schema({
  name: String,
  email: String,
  nickname: {
    type: String,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  invitations: [{
    type: Schema.Types.ObjectId,
    ref: 'member'
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'member'
  }]
})

Group.methods.haveInvited = function(memberId) {
  return this.invitations.indexOf(memberId) > -1
}

Group.methods.addMember = function(memberId) {
  this.invitations.slice(this.invitations.indexOf(memberId), 1)
  this.members.push(memberId)
  return this.saveAsync()
}

export default Group
