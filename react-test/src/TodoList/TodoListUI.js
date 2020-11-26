import React from 'react'

class TodoListUI extends React.Component {
  render() {
    let filter_arr = [{
      name: '全部',
      filter: 'all'
    }, {
      name: '未完成',
      filter: 'active'
    }, {
      name: '完成',
      filter: 'completed'
    }]
    const { value, list, filter, handleAdd, handleInputChange, handleFilter, handleDelete } = this.props
    return (
      <div className="todoListUI">
        <input value={value} onChange={(e) => handleInputChange(e.target.value)} />
        <button onClick={handleAdd}>添加</button>
        <div>
          {
            filter_arr.map((item, i) => (
              <span style={{ color: item.filter === filter && '#f55' }} key={i} onClick={() => handleFilter(item.filter)}>{item.name}</span>
            ))
          }
        </div>
        <ul>
          {
            list.filter(item => filter === 'all' || item.filter === filter)
              .map((item, index) =>
                <li key={index} onClick={() => handleDelete(item)}>{item.value}</li>
              )
          }
        </ul>
      </div>
    )
  }
}

export default TodoListUI