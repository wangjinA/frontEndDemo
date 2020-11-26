import * as actionTypes from './actionTypes'
const defaultState = {
  value: '',
  list: [],
  filter: 'all'
}
const reducer = (state = defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case actionTypes.INPUT_CHANGE:
      newState.value = action.value
      return newState
    case actionTypes.DELETE_TODO:
      return {
        ...state,
        list: state.list.map(item => {
          return item === action.index ? { ...item, filter: 'completed' } : item
        })
      }
    case actionTypes.ADD_TODO:
      if (state.value) {
        newState.list.unshift({
          filter: 'active',
          value: state.value
        })
        newState.value = ''
        return newState
      } else {
        console.log('请输入');
        return state
      }
    case actionTypes.SET_FILTER:
      newState.filter = action.filter
      return newState
    default:
      return state
  }
}

export default reducer
