import React, { useState } from 'react';
import { Input, Button, message, Form } from 'antd';
import axios from 'axios';

function Create({ addTodo }) {
  const [task, setTask] = useState('');

  const handleAdd = async () => {
    if (task.trim() === '') {
      message.error('Task cannot be empty!');
      return;
    }

    try {
      const result = await axios.post(`${import.meta.env.VITE_APP_API_KEY}/add`, { task });
      addTodo(result.data);
      setTask('');
      message.success('Task added successfully!');
    } catch (error) {
      message.error('Failed to add task!');
    }
  };

  return (
    <Form layout="inline" onFinish={handleAdd}>
      <Form.Item>
        <Input
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{ width: '300px' }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add</Button>
      </Form.Item>
    </Form>
  );
}

export default Create;
