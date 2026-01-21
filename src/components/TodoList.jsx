import { useReducer, useState, useRef } from "react";
import styles from "./TodoList.module.css"

const initialState = {
    todos: [],
    nextId: 1,
    draggable: false
}

function todoReducer(state, action) {
    switch (action.type) {
        case "ADD_TODO": {
            const newTodo = {
                id: state.nextId,
                text: action.payload,
                completed: false
            };

            return {
                ...state,
                todos: [...state.todos, newTodo],
                nextId: state.nextId + 1
            };

        }

        case "REMOVE_TODO": {
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            }

        }

        case "TOGGLE_TODO": {

            return {
                ...state,
                todos: state.todos.map(todo => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo)
            }
        }
        case "MOVE_TODO": {
            const { dragIndex, dropIndex } = action.payload;
            const newTodos = [...state.todos];
            const [removed] = newTodos.splice(dragIndex, 1);
            newTodos.splice(dropIndex, 0, removed);

            return {
                ...state,
                todos: newTodos
            }
        }
        case "TOGGLE_DRAGGABLE": {
            return {
                ...state,
                draggable: !state.draggable
            };
        }
        default: {
            return state

        }
    }
}

function TodoList() {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const [inputValue, setInputValue] = useState('');

    function handleAdd() {
        dispatch({ type: "ADD_TODO", payload: inputValue });
        setInputValue("");
    }

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


        dispatch({ type: "MOVE_TODO", payload: { dragIndex, dropIndex } })
        draggedIndexRef.current = dropIndex;
    }

    function handleDragEnd() {
        draggedIndexRef.current = null;
    }

    return (
        <div>
            <h2>My todos</h2>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="lägg till todo" />
            <button onClick={() => handleAdd()}>Add Todo</button>
            <ul className={styles.todoList}>
                <button onClick={() => dispatch({type: "TOGGLE_DRAGGABLE"})}>{state.draggable ? "Disable" : "Enable"} Drag & Drop</button>
                {
                    state.todos.map((todo, index) => (
                        <li key={todo.id}
                            draggable={state.draggable}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={styles.todoItem}
                        >
                            <input type="checkbox" onChange={() => { dispatch({ type: "TOGGLE_TODO", payload: todo.id }) }} />
                            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</span>
                            <button onClick={() => dispatch({ type: "REMOVE_TODO", payload: todo.id })}>Remove</button>
                        </li>))
                }
            </ul>
            <p>Amout of Todos: {state.todos.length}</p>
        </div>
    )
}

export default TodoList;
