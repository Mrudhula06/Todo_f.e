import React, { useEffect, useState } from 'react';
import Create from './Create'; // Assuming this is the updated Create component
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencilSquare } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editTask, setEditTask] = useState('');

    useEffect(() => {
        fetchTodos(); // Fetch todos on initial render
    }, []);

    const handleEdit = (id) => {
        axios.put(`${import.meta.env.VITE_APP_API_KEY}/update/${id}`)
            .then(result => {
                if (result.data) {
                    setTodos(prevTodos => 
                        prevTodos.map(todo => 
                            todo._id === id ? { ...todo, done: !todo.done } : todo
                        )
                    );
                } else {
                    console.warn('Unexpected data format received:', result.data);
                }
            })
            .catch(err => console.error('Error updating todo:', err));
    };

    const handleDelete = (id) => {
        axios.delete(`${import.meta.env.VITE_APP_API_KEY}/delete/${id}`)
            .then(result => {
                if (result.data) {
                    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
                } else {
                    console.warn('Unexpected data format received:', result.data);
                }
            })
            .catch(err => console.error('Error deleting todo:', err));
    };

    const handleEditSubmit = (id) => {
        axios.put(`${import.meta.env.VITE_APP_API_KEY}/edit/${id}`, { task: editTask })
            .then(result => {
                if (result.data) {
                    setTodos(prevTodos => 
                        prevTodos.map(todo => 
                            todo._id === id ? { ...todo, task: editTask } : todo
                        )
                    );
                    setEditingTodoId(null);
                    setEditTask('');
                } else {
                    console.warn('Unexpected data format received:', result.data);
                }
            })
            .catch(err => console.error('Error updating todo:', err));
    };

    const fetchTodos = () => {
        axios.get(`${import.meta.env.VITE_APP_API_KEY}/get`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setTodos(response.data);
                } else {
                    console.warn('Unexpected data format received:', response.data);
                    setTodos([]); // Handle non-array data
                }
            })
            .catch(error => console.error('Error fetching data:', error)); // Improved error message
    };

    const addTodo = (newTodo) => {
        if (newTodo && newTodo.task) { // Check if newTodo is not empty and has a task property
            setTodos(prevTodos => [...prevTodos, newTodo]);
        }
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create addTodo={addTodo} /> {/* Pass addTodo function as prop to Create component */}
            {todos.length === 0 ? (
                <div><h2>No Record</h2></div>
            ) : (
                todos.map((todo, index) => (
                    <div className='task' key={index}>
                        {editingTodoId === todo._id ? (
                            <div className='edit-form'>
                                <input 
                                    type='text' 
                                    value={editTask} 
                                    onChange={(e) => setEditTask(e.target.value)} 
                                />
                                <button onClick={() => handleEditSubmit(todo._id)}>Save</button>
                                <button onClick={() => setEditingTodoId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                                    {todo.done ? 
                                        <BsFillCheckCircleFill className='icon' /> :
                                        <BsCircleFill className='icon' />
                                    }
                                    <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                                </div>
                                <div className='actions'>
                                    <BsPencilSquare className='icon' onClick={() => {
                                        setEditingTodoId(todo._id);
                                        setEditTask(todo.task);
                                    }} />
                                    <BsFillTrashFill className='icon' onClick={() => handleDelete(todo._id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
