import { useState } from "react"

const API = import.meta.env.VITE_API_URL

const TaskForm = ({ listId, onTaskCreated }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      const res = await fetch(`${API}/lists/${listId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      })

      if (!res.ok) throw new Error("Error al crear tarea")
      const newTask = await res.json()
      onTaskCreated(newTask)
      setTitle("") // Limpia el campo al crear
    } catch (error) {
      console.error("Error al crear tarea:", error)
    }
  }
  console.log("render TaskForm")
  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // <- Esto es CLAVE
        />
        <button className="btn btn-outline-secondary" type="submit">
          Añadir
        </button>
      </div>
    </form>
  )
}

export default TaskForm
