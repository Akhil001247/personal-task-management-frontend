import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

 
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editTaskId) {
        await axios.put(
          `${BASE_URL}/api/tasks/${editTaskId}`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditTaskId(null);
      } else {
        await axios.post(
          `${BASE_URL}/api/tasks`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error creating/updating task:", err);
    }
  };

  
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };


  const handleEdit = (task) => {
    setTitle(task.title);
    setEditTaskId(task._id);
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome,<span className="text-blue-500"> {username} </span>  Stay organized, manage your daily tasks efficiently, and achieve your goals. Let’s make your day productive and focused—one task at a time</h2>
        <button
          onClick={handleLogout}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Task Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 flex gap-4"
      >
        <input
          type="text"
          placeholder="Enter Your Task  Here..."
          className="flex-1 border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {editTaskId ? "Update" : "Add"}
        </button>
      </form>

      <h3 className="text-xl mb-4">Your Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <span>{task.title}</span>
              <div className="space-x-2">
                <button
                  className="bg-blue-700 px-3 py-1 rounded text-white hover:bg-blue-600"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-700 px-3 py-1 rounded text-white hover:bg-red-600"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
