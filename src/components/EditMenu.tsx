import { Menu } from '@headlessui/react'
import axios from 'axios'
import { Task } from '../../types/interfaces'
import EditModal from './EditModal'
import { useState } from 'react'

function EditMenu({
  id,
  setTasks,
}: {
  id: string
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const deleteTask = () => {
    axios
      .delete(`http://localhost:8000/tasks/delete/${id}`)
      .then((response) => response.data)
      .then((data) => setTasks(data))
  }

  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [currentUpdateTask, setUpdateTask] = useState<Task>()

  const handleEdit = () => {
    axios
      .get(`http://localhost:8000/tasks/${id}`)
      .then((response) => response.data)
      .then((data) => setUpdateTask(data))
      .finally(() => setIsEditOpen(false))
  }
  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button
          className="flex items-center space-x-2"
          onClick={handleEdit}
        >
          <div className="text-lg font-bold tracking-widest cursor-pointer">
            ...
          </div>
        </Menu.Button>
        <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
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
          currentUpdateTask={currentUpdateTask!}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      ) : null}
    </>
  )
}

export default EditMenu
