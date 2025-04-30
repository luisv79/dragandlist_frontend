import { useState } from "react"

const BoardForm = ({ addBoard }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    try {
      await addBoard(trimmed)
      setTitle("")
    } catch (error) {
      console.error("Error al agregar tablero:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="formulario-principal">
      <input
        type="text"
        className="form-control"
        placeholder="Título del tablero"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn btn-primary ms-2" type="submit">
        Crear
      </button>
    </form>
  )
}

export default BoardForm
