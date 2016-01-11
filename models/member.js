import Debug from 'debug'
import Promise from 'bluebird'
import { Schema } from 'mongoose'

const debug = Debug('mailmao:models:member')
const Member = new Schema({
  email: {
    type: String,
    unique: true
  },
  nickname: {
    type: String,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'group'
  }],
  vertified: {
    type: Number,
    default: 0
  },
  uri: String,
  phone: String,
  firstname: String,
  lastname: String,
  password: String,
  avatar: String
})

Member.static('joinGroup', function(memberId, groupId) {
  const { Group } = require('./')

  return Group.findByIdAsync(groupId)
    .then(group => {
      if (!group.haveInvited(memberId))
        throw new Error(401)

      return group.addMember(memberId)
    })
    .then(() => {
      this.findByIdAndUpdateAsync(memberId, {
        $push: {
          groups: groupId
        }
      })
    })
})
