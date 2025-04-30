import { useEffect, useState } from "react"
import BoardForm from "./components/BoardForm"
import Boards from "./components/Boards"
import Cheque from "./assets/logo-check.png"

const App = () => {
  const [boards, setBoards] = useState([])

  const API = import.meta.env.VITE_API_URL


  const getBoards = async () => {
    const response = await fetch("https://dragandlist-backend.onrender.com/boards")
    const data = await response.json()
    setBoards(data)
  }

  useEffect(() => {
    getBoards()
  }, [])

  const addBoard = async (title) => {
    const response = await fetch("https://dragandlist-backend.onrender.com/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    const newBoard = await response.json()
    setBoards([...boards, newBoard])
  }

  const removeBoard = async (id) => {
    const response = await fetch(`${API}/boards/${id}`, {
      method: "DELETE",
    })

    if (response.status !== 200) return alert("Error al eliminar")

    setBoards(boards.filter((b) => b.id !== id))
  }

  return (
    <div className="container">
      <div className="header-titulo">
      <h1 className="my-4 titulo-principal">Drag&List <span><img className="Logo-img" src={Cheque} alt="" /></span></h1>
      
      <BoardForm addBoard={addBoard} />

      </div>
      <Boards boards={boards} removeBoard={removeBoard} />
    </div>
  )
}

export default App
