import React from 'react'
import TodoListUI from './TodoListUI'
import * as actionCreators from './todoStore/actionCreators'
import { connect } from 'react-redux'
class TodoList extends React.Component {
  render() {
    return <TodoListUI
      list={this.props.list}
      value={this.props.value}
      handleInputChange={this.props.handleInputChange}
      handleDelete={this.props.handleDelete}
      handleAdd={this.props.handleAdd} />
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.todoList.list,
    value: state.todoList.value
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (value) => {
      console.log(value);
      dispatch(actionCreators.inputChange(value))
    },
    handleDelete: (index) => {
      dispatch(actionCreators.deleteTodo(index))
    },
    handleAdd: () => {
      dispatch(actionCreators.addTodo())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)