import React from 'react'
import store from '../store'
import TodoListUI from './TodoListUI'
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...store.getState()
    }
    store.subscribe(() => this.handleWatch())
  }
  handleWatch() {
    this.setState(store.getState())
  }
  handleInputChange(value) {
    console.log(value);
    store.dispatch({
      type: 'set_input',
      value
    })
  }
  handleDelete(index) {
    store.dispatch({
      type: 'delete_list',
      index
    })
  }
  add(index) {
    store.dispatch({
      type: 'add',
      index
    })
  }
  render() {
    console.log(this.state);
    return <TodoListUI list={this.state.list} value={this.state.value} handleInputChange={this.handleInputChange} handleDelete={this.handleDelete} add={this.add} />
  }
}

export default TodoList