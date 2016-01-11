import sha1 from 'sha1'

export const salt = 'Qgsqwv7rsqwUCBX'
export const salt2 = '7stsqw$g7'

export function makeSalt(str) {
  return sha1(salt + str + salt2)
}

export function toUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}