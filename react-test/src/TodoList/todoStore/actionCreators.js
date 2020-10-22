import * as actionTypes from './actionTypes'
export const deleteTodo = (index) => {
  return {
    type: actionTypes.DELETE_TODO,
    index
  }
}

export const addTodo = () => {
  return {
    type: actionTypes.ADD_TODO
  }
}

export const inputChange = (value) => {
  return {
    type: actionTypes.INPUT_CHANGE,
    value
  }
}