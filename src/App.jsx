import { useRef, useState } from 'react'
import './App.css'

function App() {

    return (
        <TodoList />
    )
}

export default App

function TodoList() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' }
    ])

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
