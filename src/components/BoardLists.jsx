import { useEffect, useState } from "react"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import ListForm from "./ListForm"
import TaskForm from "./TaskForm"

const TaskItem = ({ task, onToggle, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="list-group-item d-flex align-items-center"
    >
      <input
        type="checkbox"
        className="form-check-input me-2"
        id={`check-${task.id}`}
        checked={task.done}
        onChange={onToggle}
      />
      <label
        className="form-check-label ms-2"
        htmlFor={`check-${task.id}`}
        style={{
          textDecoration: task.done ? "line-through" : "none",
          color: task.done ? "#6c757d" : "inherit",
        }}
      >
        {task.title}
      </label>
    </li>
  )
}

const SortableList = ({ children, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: "220px",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card p-2 card-lista"
    >
      {children}
    </div>
  )
}

const BoardLists = ({ boardId }) => {
  const [lists, setLists] = useState([])

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    const fetchListsAndTasks = async () => {
      const res = await fetch(`http://localhost:5000/boards/${boardId}/lists`)
      const data = await res.json()

      const listsWithTasks = await Promise.all(
        data.map(async (list) => {
          const res = await fetch(`http://localhost:5000/lists/${list.id}/tasks`)
          const tasks = await res.json()
          return { ...list, tasks }
        })
      )

      setLists(listsWithTasks)
    }

    fetchListsAndTasks()
  }, [boardId])

  const handleTaskToggle = async (listId, taskId, done) => {
    const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    })

    const updated = await res.json()
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((t) =>
                t.id === taskId ? updated : t
              ),
            }
          : list
      )
    )
  }

  const handleDragEnd = (event) => {
   
    
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    // 1. Reordenar listas
    if (activeId.startsWith("list-") && overId.startsWith("list-")) {
      const oldIndex = lists.findIndex((l) => `list-${l.id}` === activeId)
      const newIndex = lists.findIndex((l) => `list-${l.id}` === overId)
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(lists, oldIndex, newIndex)
        setLists(reordered)
      }
      return
    }

    // 2. Reordenar o mover tareas entre listas
    const sourceList = lists.find((l) =>
      l.tasks.some((t) => t.id.toString() === activeId)
    )
    const destList = lists.find((l) =>
      l.tasks.some((t) => t.id.toString() === overId)
    )

    if (!sourceList || !destList) return

    const activeIndex = sourceList.tasks.findIndex(
      (t) => t.id.toString() === activeId
    )
    const overIndex = destList.tasks.findIndex(
      (t) => t.id.toString() === overId
    )

    const activeTask = sourceList.tasks[activeIndex]

    const updatedSourceTasks = [...sourceList.tasks]
    updatedSourceTasks.splice(activeIndex, 1)

    const updatedDestTasks = [...destList.tasks]
    updatedDestTasks.splice(overIndex, 0, activeTask)

    if (sourceList.id !== destList.id) {
      // Actualizar en el backend
      fetch(`http://localhost:5000/tasks/${activeTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list_id: destList.id }),
      }).catch((err) => console.error("Error actualizando list_id:", err))
    }

    setLists((prev) =>
      prev.map((l) => {
        if (l.id === sourceList.id) {
          return { ...l, tasks: updatedSourceTasks }
        }
        if (l.id === destList.id) {
          return { ...l, tasks: updatedDestTasks }
        }
        return l
      })
    )
  }

  return (
    <div className="d-flex gap-3 flex-wrap mt-3 list-title">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={lists.map((l) => `list-${l.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list) => (
            <SortableList key={`list-${list.id}`} id={`list-${list.id}`}>
              <h5>{list.title}</h5>

              <SortableContext
                items={list.tasks.map((t) => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <ul className="list-group">
                  {list.tasks.length === 0 ? (
                    <li className="list-group-item">Sin tareas</li>
                  ) : (
                    list.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        id={task.id.toString()}
                        onToggle={() => handleTaskToggle(list.id, task.id, task.done)}
                      />
                    ))
                  )}
                </ul>
              </SortableContext>

              <TaskForm
                listId={list.id}
                onTaskCreated={(newTask) =>
                  setLists((prev) =>
                    prev.map((l) =>
                      l.id === list.id
                        ? { ...l, tasks: [...l.tasks, newTask] }
                        : l
                    )
                  )
                }
              />
            </SortableList>
          ))}
        </SortableContext>
      </DndContext>

      <ListForm
        boardId={boardId}
        onListCreated={(newList) =>
          setLists((prev) => [...prev, { ...newList, tasks: [] }])
        }
      />
    </div>
  )
}

export default BoardLists
