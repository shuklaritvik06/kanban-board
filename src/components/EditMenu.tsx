import { Menu } from '@headlessui/react'
import { Task } from '../../types/interfaces'
import { useState } from 'react'
import EditModal from './EditModal'
import axios from 'axios'
import { filterTasks } from '../utils/app_utils'

function EditMenu({
  id,
  setTasks,
  column,
}: {
  id: string
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  column: string
}) {
  const deleteTask = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/tasks/delete/${id}`)
      .then((response) => response.data)
      .then((data) => {
        const filteredData = filterTasks(data)
        if (column === 'todos') {
          setTasks(filteredData.todos)
        } else if (column === 'progress') {
          setTasks(filteredData.progress)
        } else {
          setTasks(filteredData.done)
        }
      })
  }

  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [currentUpdateTask, setUpdateTask] = useState<Task>()

  const handleEdit = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/tasks/${id}`)
      .then((response) => response.data)
      .then((data) => {
        setUpdateTask(data)
        setIsEditOpen(true)
      })
  }
  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2">
          <div className="text-lg font-bold tracking-widest cursor-pointer">
            ...
          </div>
        </Menu.Button>
        <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleEdit}
                className={`${
                  active ? 'bg-blue-500 text-white' : 'text-gray-900'
                } flex items-center w-full px-4 py-2 text-sm`}
              >
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={deleteTask}
                className={`${
                  active ? 'bg-red-500 text-white' : 'text-gray-900'
                } flex items-center w-full px-4 py-2 text-sm`}
              >
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
      {currentUpdateTask ? (
        <EditModal
          id={id}
          setTasks={setTasks}
          column={column}
          currentUpdateTask={currentUpdateTask!}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      ) : null}
    </>
  )
}

export default EditMenu
