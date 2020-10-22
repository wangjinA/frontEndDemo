import reducers from '../TodoList/todoStore'
import { combineReducers } from 'redux'
export default combineReducers({
  todoList: reducers
})