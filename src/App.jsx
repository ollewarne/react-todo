import { useState } from 'react'
import './App.css'

function App() {

    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");

    function removeTodo(toRemove) {
        const newTodos = todos.filter(todo => todo !== toRemove)
        setTodos(newTodos)
    }

    return (
        <>
            <ul className='todoList' onClick={(e) => {removeTodo(e.target.textContent) }}>
                {
                    todos.filter(todo => todo).map(todo => <li key={todo}>{todo}</li>)
                }
            </ul>
            <input type="text" onChange={(e) => {setInputValue(e.target.value)}} />
            <button onClick={() => setTodos([...todos, inputValue])}>add todo item</button>
        </>
    )
}

export default App
