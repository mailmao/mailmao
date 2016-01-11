'use strict';

import { isBlank } from './underscore'
import { API_VERSION } from './consts'

// lowlevel api
export default {
  Get,
  Post, // Post form via `x-www-form-urlencoded`
  Put,
  Patch,
  Remove,
}

const fetch = window.fetch

function fetchData(type, data, getMode) {
  var endpoint = _endPoint(type)

  if (getMode)
    endpoint += isBlank(data) ? '' : ('?' + _formatForm(data))

  return fetch(endpoint, data)
    .then(checkStatus)
    .then(parseJSON)
    .then(success)
    .catch(errorHandle)

  function checkStatus(res) {
    if (res.status >= 200 && res.status < 500)
      return res

    throw new Error(res.statusText)
  }

  function parseJSON(res) {
    return res.json()
  }

  function success(result) {
    if (result.code)
      throw new Error(result.code)

    return Promise.resolve(result)
  }

  function errorHandle(err) {
    return Promise.reject(err)
  }
}

function Get(type, query={}) {
  return fetchData(type, query, 'get')
}

function Post(type, data={}) {
  return fetchData(type, {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    'body': _formatForm(data)
  })
}

function Put(type, data={}) {
  return fetchData(type, {
    'method': 'put',
    'body': _formatForm(data)
  })
}

function Patch(type, data={}) {
  return fetchData(type, {
    'method': 'patch',
    'body': _formatForm(data)
  })
}

function Remove(type, data={}) {
  return fetchData(type, {
    'method': 'delete',
    'body': _formatForm(data)
  })
}

// IE 9 +
function _formatForm(obj) {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')
}

function _endPoint(type) {
  return `${window.location.protocol}//${window.location.host}/api/${API_VERSION}/${type}`
}
