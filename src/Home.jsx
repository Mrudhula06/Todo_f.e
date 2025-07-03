import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencilSquare } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editTask, setEditTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = (newTodo) => {
        if (newTodo && newTodo.task) {
            setTodos(prevTodos => [...prevTodos, newTodo]);
        }
    };

    const fetchTodos = () => {
        axios.get(`${import.meta.env.VITE_APP_API_KEY}/get`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setTodos(response.data);
                } else {
                    setTodos([]);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleEdit = (id) => {
        // Implement edit functionality
    };

    const handleEditSubmit = (id) => {
        // Implement save edit functionality
    };

    const handleDelete = (id) => {
        axios.delete(`${import.meta.env.VITE_APP_API_KEY}/delete/${id}`)
            .then(() => fetchTodos())
            .catch(error => console.error('Error deleting todo:', error));
    };

    const handlePriorityToggle = (id) => {
        const todo = todos.find(todo => todo._id === id);
        axios.put(`${import.meta.env.VITE_APP_API_KEY}/updatePriority/${id}`, {
            priority: !todo.priority
        })
            .then(() => fetchTodos())
            .catch(error => console.error('Error updating priority:', error));
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create addTodo={addTodo} />
            {todos.length === 0 ? (
                <div><h2>No Record</h2></div>
            ) : (
                todos.map((todo, index) => (
                    <div
                        className={`task ${todo.priority ? 'high-priority' : 'low-priority'}`}
                        key={index}
                    >
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
                                    <BsPencilSquare
                                        className='icon'
                                        onClick={() => {
                                            setEditingTodoId(todo._id);
                                            setEditTask(todo.task);
                                        }}
                                    />
                                    <BsFillTrashFill
                                        className='icon'
                                        onClick={() => handleDelete(todo._id)}
                                    />
                                    <span
                                        className={`priority-toggle ${todo.priority ? 'high-priority' : 'low-priority'}`}
                                        onClick={() => handlePriorityToggle(todo._id)}
                                    >
                                        {todo.priority ? 'High Priority' : 'Low Priority'}
                                    </span>
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
