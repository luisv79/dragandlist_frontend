import BoardLists from "./BoardLists"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const Boards = ({ boards, removeBoard }) => {
  return (
    <div className="row">
      {boards.map((board) => (
        <div className="col-12 mb-4" key={board.id}>
          <div className="card tablero">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center board-title">
                <h3>{board.title}</h3>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => removeBoard(board.id)}
                ><FontAwesomeIcon icon={faXmark} />
                 
                </button>
              </div>

              <BoardLists boardId={board.id} />
            </div>
          </div>
        </div>
      ))}

      {boards.length === 0 && <p>No hay tableros</p>}
    </div>
  )
}

export default Boards
