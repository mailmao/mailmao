'use strict';

export default {
  each,
  isBlank,
}

function each(arrOrObject, fn) {
  for (let i = 0; i < arrOrObject.length; i++) {
    fn(arrOrObject[i], i)
  }
}

function isBlank(obj) {
  return Object.keys(obj).length === 0
}
