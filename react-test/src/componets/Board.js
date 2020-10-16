import React from "react";
import Square from "./Square";
import "./index.css";
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: new Array(9).fill(null),
      current: "X",
      history: [new Array(9).fill(null)],
      historyIndex: 0
    };
  }
  clickHandler(index) {
    if (this.state.arr[index]) {
      return
    }
    let arr = this.state.arr.slice();
    arr[index] = this.state.current
    this.state.history.push(arr)
    this.setState({
      current: this.state.current === 'X' ? 'O' : 'X',
      arr,
      history: this.state.history,
      historyIndex: ++this.state.historyIndex
    })
  }
  // 撤回
  handleWithdraw() {
    // return console.log(this.state.history[--this.state.historyIndex]);
    this.setState({
      arr: this.state.history[--this.state.historyIndex],
      historyIndex: this.state.historyIndex
    })
  }
  render() {
    const status = `Next player: ${this.state.current}`;
    return (
      <div>
        <div>{status}</div>
        <div className="wrap">
          {this.state.arr.map((item, i) => (
            <Square onClick={() => this.clickHandler(i)} key={i} value={item}></Square>
          ))}
        </div>
        {
          this.state.historyIndex !== 0 && <button onClick={() => this.handleWithdraw()}>撤回</button>
        }
      </div>
    );
  }
}
export default Board;
