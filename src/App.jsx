import { useRef, useState } from 'react'
import './App.css'

function App() {

    const [todos, setTodos] = useState([])
    const inputValue = useRef("")

    const generateId = () => {
        return Math.random().toString(36).substring(2, 6);
    };

    function addTodo() {
        const todoId = generateId();
        const todo = {id: todoId, text: inputValue.current}
        setTodos([todo, ...todos])
    }

    return (
        <>
            <TodoList todos={todos} setTodos={setTodos} />
            <div>
                <input type="text" onChange={(e) => inputValue.current = e.target.value} />
                <button onClick={addTodo}>Add Todo</button>
            </div>
        </>
    )
}

export default App

function TodoList({ todos = [], setTodos = () => { } }) {

    const draggedIndexRef = useRef(null);

    function handleDragStart(e, index) {
        draggedIndexRef.current = index;
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        draggedIndexRef.current = null;
    }

    function handleDragEnter(e, dropIndex) {
        const dragIndex = draggedIndexRef.current;

        if (dragIndex === dropIndex || dragIndex === null) return;

        const newTodos = [...todos];
        const [removed] = newTodos.splice(dragIndex, 1);
        newTodos.splice(dropIndex, 0, removed);

        setTodos(newTodos);
        draggedIndexRef.current = dropIndex;
    }

    function handleDragEnd() {
        draggedIndexRef.current = null;
    }

    return (
        <div>
            {todos.map((todo, index) => (
                <div
                    key={todo.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{ padding: '16px 48px 16px 48px', margin: '5px', border: '1px solid black', transition: 'all 0.2s ease' }}
                >
                    {todo.text}
                </div>
            ))}
        </div>
    )

}
