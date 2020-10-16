import React from "react";
class Square extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            a: 1
        }
    }
    render() {
        return <button onClick={this.props.onClick}>{this.props.value}</button>
    }
}

export default Square