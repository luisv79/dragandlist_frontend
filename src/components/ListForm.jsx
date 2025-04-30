import { useState } from "react"

const API = import.meta.env.VITE_API_URL

const ListForm = ({ boardId, onListCreated }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const res = await fetch(`${API}/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      if (!res.ok) throw new Error("Error al crear lista")

      const newList = await res.json()
      onListCreated(newList)
      setTitle("")
    } catch (error) {
      console.error("Error al crear lista:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Nueva lista"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Añadir lista
        </button>
      </div>
    </form>
  )
}

export default ListForm
