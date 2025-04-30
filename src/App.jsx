import { useEffect, useState } from "react"
import BoardForm from "./components/BoardForm"
import Boards from "./components/Boards"
import Cheque from "./assets/logo-check.png"

const App = () => {
  const [boards, setBoards] = useState([])

  const API = import.meta.env.VITE_API_URL

  const getBoards = async () => {
    try {
      const response = await fetch(`${API}/boards`)
      if (!response.ok) throw new Error("Error al obtener tableros")
      const data = await response.json()
      setBoards(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getBoards()
  }, [])

  const addBoard = async (title) => {
    try {
      const response = await fetch(`${API}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!response.ok) throw new Error("Error al crear tablero")
      const newBoard = await response.json()
      setBoards([...boards, newBoard])
    } catch (err) {
      console.error(err)
    }
  }

  const removeBoard = async (id) => {
    try {
      const response = await fetch(`${API}/boards/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Error al eliminar tablero")
      setBoards(boards.filter((b) => b.id !== id))
    } catch (err) {
      console.error(err)
      alert("Error al eliminar")
    }
  }

  return (
    <div className="container">
      <div className="header-titulo">
        <h1 className="my-4 titulo-principal">
          Drag&List <span><img className="Logo-img" src={Cheque} alt="" /></span>
        </h1>
        <BoardForm addBoard={addBoard} />
      </div>

      <Boards boards={boards} removeBoard={removeBoard} />
    </div>
  )
}

export default App
