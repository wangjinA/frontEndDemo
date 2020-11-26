import React from 'react'
import TodoListUI from './TodoListUI'
import * as actionCreators from './todoStore/actionCreators'
import { connect } from 'react-redux'
class TodoList extends React.Component {
  componentWillMount() {

  }
  render() {
    return <TodoListUI
      list={this.props.list}
      value={this.props.value}
      filter={this.props.filter}
      handleInputChange={this.props.handleInputChange}
      handleDelete={this.props.handleDelete}
      handleAdd={this.props.handleAdd}
      handleFilter={this.props.handleFilter} />
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.todoList.list,
    value: state.todoList.value,
    filter: state.todoList.filter
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
    },
    handleFilter: (filter) => {
      dispatch(actionCreators.setFilter(filter))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)