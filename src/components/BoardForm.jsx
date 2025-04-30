import { useState } from "react"

const BoardForm = ({ addBoard }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title) return
    await addBoard(title)
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit} className="formulario-principal">
      <input
        type="text"
        className="form-control"
        placeholder="Titulo del tablero"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn btn-primary  ms-2" type="submit">
        Crear 
      </button>
    </form>
  )
}

export default BoardForm
