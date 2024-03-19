import { Fragment, useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd'
import { Task } from '../types/interfaces'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Modal from './components/Modal'
import Loader from './components/Loader'

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [todosTasks, setTodosTasks] = useState<Task[]>([])
  const [onProgressTasks, setOnProgressTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const filterTasks = (tasks: Task[]) => {
    const todos = tasks.filter((item) => item.column === 1)
    const progress = tasks.filter((item) => item.column === 2)
    const done = tasks.filter((item) => item.column === 3)
    return { todos, progress, done }
  }

  useEffect(() => {
    setLoading(true)
    axios
      .get('http://localhost:8000/tasks')
      .then((response) => response.data)
      .then((data) => {
        const { done, progress, todos } = filterTasks(data)
        setDoneTasks(done)
        setOnProgressTasks(progress)
        setTodosTasks(todos)
      })
      .finally(() => setLoading(false))
  }, [])

  const openModal = (): void => {
    setIsOpen(!isOpen)
  }

  const titleCase = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
  const renderTasks = (taskList: Task[]): JSX.Element[] => {
    return taskList?.map((item, index) => (
      <Draggable
        key={item?._id}
        draggableId={item?._id.toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            className="rounded-2xl p-6 bg-white"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="flex justify-between">
              <div
                className={`${
                  item?.priority === 'low'
                    ? 'bg-lowBg text-lowText'
                    : item?.priority === 'high'
                      ? 'bg-highBg text-red-900'
                      : 'bg-green-300 text-green-900'
                } font-medium px-3 py-1 rounded-md tracking-wide`}
              >
                {titleCase(item?.priority)}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <div className="font-bold text-2xl">{item?.title}</div>
              <div className="font-light text-taskText">{item?.body}</div>
            </div>
          </div>
        )}
      </Draggable>
    ))
  }
  const handleUpdate = async (task: Task, destination: DraggableLocation) => {
    try {
      const columnMap: { [key: string]: { column: number; priority: string } } =
        {
          toDos: { column: 1, priority: 'low' },
          onProgress: { column: 2, priority: 'high' },
          doneTasks: { column: 3, priority: 'completed' },
        }

      const { column, priority } = columnMap[destination.droppableId]

      await axios.put(`http://localhost:8000/tasks/update/${task._id}`, {
        column,
        priority:
          destination.droppableId === 'doneTasks' ? 'completed' : priority,
      })
      toast.success('Updated the Task')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return
    let sourceElement: Task | undefined
    let todos = [...todosTasks]
    let onProgress = [...onProgressTasks]
    let completed = [...doneTasks]
    if (source.droppableId === 'toDos') {
      sourceElement = todos[source.index]
      todos.splice(source.index, 1)
    } else if (source.droppableId === 'onProgress') {
      sourceElement = onProgress[source.index]
      onProgress.splice(source.index, 1)
    } else if (source.droppableId === 'doneTasks') {
      sourceElement = completed[source.index]
      completed.splice(source.index, 1)
    }
    if (sourceElement !== undefined) {
      if (destination.droppableId === 'toDos') {
        sourceElement.priority = 'low'
        todos.splice(destination.index, 0, sourceElement)
        handleUpdate(sourceElement, destination)
      } else if (destination.droppableId === 'onProgress') {
        sourceElement.priority = 'high'
        onProgress.splice(destination.index, 0, sourceElement)
        handleUpdate(sourceElement, destination)
      } else if (destination.droppableId === 'doneTasks') {
        sourceElement.priority = 'completed'
        completed.splice(destination.index, 0, sourceElement)
        handleUpdate(sourceElement, destination)
      }
    }
    setTodosTasks(todos)
    setOnProgressTasks(onProgress)
    setDoneTasks(completed)
  }

  return (
    <Fragment>
      <Toaster position="top-right" />
      {loading ? (
        <Loader />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <h1 className="text-4xl font-semibold text-[#333] text-center mt-7">
            Kanban Board
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto gap-3 mt-20 px-2">
            <Droppable droppableId="toDos">
              {(provided) => (
                <div
                  className="bg-columnBg rounded-xl p-6"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-primary h-2 w-2"></div>
                      <div className="font-medium text-[16px]">To Do</div>
                      <div className="rounded-full bg-gray-200 px-[0.5rem] text-[#625F6D] font-semibold">
                        {todosTasks?.length}
                      </div>
                    </div>
                    <div
                      className="bg-primary/20 rounded-md text-primary font-bold text-lg px-2 py-2 cursor-pointer"
                      onClick={openModal}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 4.25H5.75V1C5.75 0.59 5.41 0.25 5 0.25C4.59 0.25 4.25 0.59 4.25 1V4.25H1C0.59 4.25 0.25 4.59 0.25 5C0.25 5.41 0.59 5.75 1 5.75H4.25V9C4.25 9.41 4.59 9.75 5 9.75C5.41 9.75 5.75 9.41 5.75 9V5.75H9C9.41 5.75 9.75 5.41 9.75 5C9.75 4.59 9.41 4.25 9 4.25Z"
                          fill="#5030E5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="h-1 bg-primary w-full mt-4"></div>
                  <div className="mt-5 space-y-4">
                    {renderTasks(todosTasks)}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="onProgress">
              {(provided) => (
                <div
                  className="bg-columnBg rounded-xl p-6"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-secondary h-2 w-2"></div>
                    <div className="font-medium text-[16px]">On Progress</div>
                    <div className="rounded-full bg-gray-200 px-[0.5rem] text-[#625F6D] font-semibold">
                      {onProgressTasks?.length}
                    </div>
                  </div>
                  <div className="h-1 bg-yellow-500 w-full mt-5"></div>
                  <div className="mt-5 space-y-4">
                    {renderTasks(onProgressTasks)} {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="doneTasks">
              {(provided) => (
                <div
                  className="bg-columnBg rounded-xl p-6"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-tertiary h-2 w-2"></div>
                    <div className="font-medium text-[16px]">Done</div>
                    <div className="rounded-full bg-gray-200 px-[0.5rem] text-[#625F6D] font-semibold">
                      {doneTasks?.length}
                    </div>
                  </div>
                  <div className="h-1 bg-green-500 w-full mt-5"></div>
                  <div className="mt-5 space-y-4">
                    {renderTasks(doneTasks)} {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} setTasks={setTodosTasks} />
    </Fragment>
  )
}

export default App
