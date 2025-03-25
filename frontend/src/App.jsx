import axios from 'axios';
import './App.css'
import { useEffect, useState } from 'react';
const baseUrl = 'http://localhost:3000';
function App() {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tasks`);
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCheckbox = async (id, completed) => {
    try {
      await axios.put(`${baseUrl}/tasks/${id}`, { completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${baseUrl}/tasks`, {
        title: editTitle,
        description: editDescription,
      });
      fetchTasks();
      setEditId(null);
      setEditTitle('');
      setEditDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  const handleSave = async (id) => {
    try {
      await axios.put(`${baseUrl}/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      fetchTasks();
      setEditId(null);
      setEditTitle('');
      setEditDescription('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Task List</h1>
        <button className='border-1 text-md p-2 rounded-md bg-white hover:bg-black hover:text-white font-semibold cursor-pointer'
          onClick={() => setEditId('new')}
        >
          Create Task
        </button>
      </div>
      {editId === 'new' && (
        <div className="space-y-2 border p-2 rounded-md my-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border p-1 rounded-md"
            placeholder="Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full border p-1 rounded-md"
            placeholder="Description"
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="bg-green-500 px-2 py-1 text-white rounded-md cursor-pointer">Save</button>
            <button onClick={handleCancel} className="bg-red-500 px-2 py-1 text-white rounded-md cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="border p-2 rounded-md my-2">
            {editId === task._id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-1 rounded-md"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border p-1 rounded-md"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(task._id)} className="bg-green-500 px-2 py-1 text-white rounded-md cursor-pointer">
                    Save
                  </button>
                  <button onClick={handleCancel} className="bg-red-500 px-2 py-1 text-white rounded-md cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div onDoubleClick={() => handleEdit(task)} className="flex flex-col p-2.5">
                <div className="flex gap-2 my-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCheckbox(task._id, !task.completed)}
                    className='cursor-pointer w-8'
                  />
                  <button onClick={() => handleEdit(task)} className="bg-blue-500 px-2 py-1 text-white rounded-md cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="bg-red-500 px-2 py-1 text-white rounded-md cursor-pointer">Delete</button>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
