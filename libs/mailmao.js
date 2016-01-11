'use strict';

// Global deps
import 'script!es6-promise-polyfill'
import 'script!whatwg-fetch'
import Vue from 'vue'
import VueRouter from 'vue-router'

// Local deps
import routes from './routes'
import { limit } from './filters'

// App Styles
import '../css/mailmao.css'

// Init Vue app
Vue.config.debug = true
Vue.use(VueRouter)

// Register filters globally
Vue.filter('limit', limit)

const router = new VueRouter()

router.map(routes)
router.beforeEach(() => window.scrollTo(0, 0))
router.start(new Vue({}), '#mailmao')
