import * as actionTypes from './actionTypes'
import axios from 'axios'
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

export const setFilter = filter => {
  return {
    type: actionTypes.SET_FILTER,
    filter
  }
}

export const getList = filter => {
  return (dispatch) => {
    axios.get('/api/list.json')
      .then(res => {

      })
  }
}