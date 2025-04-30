import { useState } from "react"

const TaskForm = ({ listId, onTaskCreated }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const res = await fetch(`http://localhost:5000/lists/${listId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      const newTask = await res.json()
      onTaskCreated(newTask)
      setTitle("")
    } catch (error) {
      console.error("Error al crear tarea:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="submit">
          Añadir
        </button>
      </div>
    </form>
  )
}

export default TaskForm
