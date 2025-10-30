import { useState } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks((prev) => [...prev, newTask.trim()]);
    setNewTask("");
  };

  const handleDeleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full w-full p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
          >
            <span>{task}</span>
            <button
              onClick={() => handleDeleteTask(index)}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
