'use strict';

export default {
  limit
}

function limit(value) {
  if (!value)
    return ''
  
  return value.substr(0, 50) + '...'
}