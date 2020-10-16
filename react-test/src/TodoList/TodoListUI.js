import React from 'react'

class TodoListUI extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="todoListUI">
        <input value={this.props.value} onChange={(e) => this.props.handleInputChange(e.target.value)} />
        <button onClick={this.props.add} onClick={this.props.add}>添加</button>
        <ul>
          {
            this.props.list.map((item, index) => <li key={index} onClick={() => this.props.handleDelete(index)}>{item}</li>)
          }
        </ul>
      </div>
    )
  }
}

export default TodoListUI