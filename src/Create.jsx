import React, { useState } from 'react';
import axios from 'axios';

function Create({ addTodo }) {
  const [task, setTask] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (task.trim() === '') {
      setError('Empty record cannot be added');
      return;
    }

    axios.post('http://localhost:3000/add', { task: task })
      .then(result => {
        addTodo(result.data); // Call addTodo with the new todo
        setTask(''); // Clear the input field after successful addition
        setError(''); // Clear the error message after successful addition
      })
      .catch(err => console.log(err));
  };

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  return (
    <div className='create'>
      <input 
        type="text" 
        placeholder="Enter task" 
        className="create_input" 
        onChange={handleChange} 
        value={task} // Ensure input field is controlled
      />
      <button 
        type="button" 
        className="add_button" 
        onClick={handleAdd}
      >
        Add
      </button>
      {error && <p className="error_message">{error}</p>}
    </div>
  );
}

export default Create;
