'use strict';

import Landing from '../components/landing.vue'
import Dashboard from '../components/dashboard.vue'
import Member from '../components/member.vue'

export default {
  '/': {
    name: 'landing',
    component: Landing
  },
  '/dashboard': {
    name: 'dashboard',
    component: Dashboard
  },
  '/member/:id': {
    name: 'member',
    component: Member
  }
}