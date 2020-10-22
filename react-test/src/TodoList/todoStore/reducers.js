import * as actionTypes from './actionTypes'
const defaultState = {
  value: '',
  list: [],
}
const reducer = (state = defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(state))
  if (action.type === actionTypes.INPUT_CHANGE) {
    newState.value = action.value
    return newState
  }
  if (action.type === actionTypes.DELETE_TODO) {
    newState.list.splice(action.index, 1)
    return newState
  }
  if (action.type === actionTypes.ADD_TODO) {
    newState.list.unshift(state.value)
    newState.value = ''
    return newState
  }

  return state
}

export default reducer
