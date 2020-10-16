import { createStore } from 'redux'
const defaultState = {
  value: '',
  list: [],
}
const store = createStore((state = defaultState, action) => {
  const newState = { ...state }
  if (action.type === 'set_input') {
    newState.value = action.value
    console.log(newState);
    return newState
  }
  if (action.type === 'delete_list') {
    newState.list.splice(action.index, 1)
    return newState
  }
  if (action.type === 'add') {
    newState.list.unshift(state.value)
    newState.value = ''
    return newState
  }

  return state
})

export default store