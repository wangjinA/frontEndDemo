import React from "react";
import Game from './componets/Game'
import TodoList from './TodoList/TodoList'
import { Provider } from 'react-redux'
import store from './store'
function App() {
  return (
    <Provider store={store}>
      <Game />
      <TodoList />
    </Provider>
  );
}

export default App;
