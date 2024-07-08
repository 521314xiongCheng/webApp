'use strict';
import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

export default function createStore(initState) {
  const states = {
    ...initState
  }
  return new Vuex.Store({
    state: states,
    actions,
    mutations
  });
}