import axios from "axios";

const TaskItem = ({ task, refresh }) => {
  // ✅ Get API base URL from .env
  const BASE_URL = import.meta.env.VITE_API_URL;

  const toggleComplete = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/tasks/${task._id}`,
        { completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      refresh();
    } catch (err) {
      alert("Failed to update task status.");
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      refresh();
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3
          className={`font-semibold ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={toggleComplete}
          className="text-sm px-2 py-1 bg-yellow-400 rounded"
        >
          {task.completed ? "Undo" : "Done"}
        </button>
        <button
          onClick={deleteTask}
          className="text-sm px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
