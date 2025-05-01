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
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Test input directo"
      style={{ width: "100%", padding: "10px", marginTop: "1rem" }}
    />
  )
  
}

export default TaskForm
