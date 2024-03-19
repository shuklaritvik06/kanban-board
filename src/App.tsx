import { Fragment, useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Task } from '../types/interfaces'
import axios from 'axios'
import Modal from './components/Modal'
import EditMenu from './components/EditMenu'
import Loader from './components/Loader'

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  const [todosTasks, setTodosTasks] = useState<Task[]>([])
  const [onProgressTasks, setOnProgressTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])

  useEffect(() => {
    setLoading(true)
    axios
      .get('http://localhost:8000/tasks')
      .then((response) => response.data)
      .then((data) => {})
      .finally(() => setLoading(false))
  }, [])

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openModal = (): void => {
    setIsOpen(!isOpen)
  }

  const titleCase = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const renderTasks = (taskList: Task[]): JSX.Element[] => {
    return taskList?.map((item, index) => (
      <Draggable key={item._id} draggableId={item._id.toString()} index={index}>
        {(provided) => (
          <div
            key={item._id}
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
              <EditMenu id={item?._id} setTasks={setTasks} />
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

  const onDragEnd = (result: any) => {
    // const { source, destination, draggableId } = result
    // if (!destination) return
    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // )
    //   return
    // const sourceList = tasks[source.droppableId]
    // const destinationList = tasks[destination.droppableId]
    // const draggedItem = sourceList.find(
    //   (task) => task._id.toString() === draggableId
    // )
    // const updatedSourceList = Array.from(sourceList)
    // updatedSourceList.splice(source.index, 1)
    // const updatedDestinationList = Array.from(destinationList)
    // updatedDestinationList.splice(destination.index, 0, draggedItem)
    // setTasks({
    //   ...tasks,
    //   [source.droppableId]: updatedSourceList,
    //   [destination.droppableId]: updatedDestinationList,
    // })
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto gap-3 mt-20 px-2">
            <div className="bg-columnBg rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary h-2 w-2"></div>
                  <div className="font-medium text-[16px]">To Do</div>
                  <div className="rounded-full bg-gray-200 px-[0.5rem] text-[#625F6D] font-semibold">
                    {}
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
              <Droppable droppableId="toDos">
                {(provided) => (
                  <div
                    className="mt-5 space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {renderTasks([])}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="bg-columnBg rounded-xl p-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-secondary h-2 w-2"></div>
                <div className="font-medium text-[16px]">On Progress</div>
                <div className="rounded-full bg-gray-200 px-[0.5rem] text-[#625F6D] font-semibold">
                  {tasks?.onProgress?.length}
                </div>
              </div>
              <div className="h-1 bg-yellow-500 w-full mt-5"></div>
              <Droppable droppableId="onProgress">
                {(provided) => (
                  <div
                    className="mt-5 space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {renderTasks([])}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="bg-columnBg rounded-xl p-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-tertiary h-2 w-2"></div>
                <div className="font-medium text-[16px]">Done</div>
                <div className="rounded-full bg-gray-200 px-[0.5rem] text-[#625F6D] font-semibold">
                  {tasks?.doneTasks?.length}
                </div>
              </div>
              <div className="h-1 bg-green-500 w-full mt-5"></div>
              <Droppable droppableId="doneTasks">
                {(provided) => (
                  <div
                    className="mt-5 space-y-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {renderTasks([])}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      )}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} setTasks={setTasks} />
    </Fragment>
  )
}

export default App
