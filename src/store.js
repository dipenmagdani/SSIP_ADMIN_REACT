// import { createStore } from 'redux'
const redux = require('redux')
const initialState = {
  sidebarShow: true,
}
const initalBatchesState = {
  Batches: [],
}
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = redux.createStore(changeState)
export default store
