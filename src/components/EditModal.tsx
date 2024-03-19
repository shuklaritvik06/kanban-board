import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Task } from '../../types/interfaces'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function EditModal({
  isOpen,
  setIsOpen,
  setTasks,
  currentUpdateTask,
  id,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  id: string
  currentUpdateTask: Task
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (data: any) => {
    setSubmitting(true)
    axios
      .post('http://localhost:8000/tasks/update/', {
        title: data.title,
        body: data.desc,
        priority: data.priority,
        column: 1,
      })
      .then((res) => {
        setTasks(res.data)
        setIsOpen(false)
      })
      .catch((error) => {
        console.error('Error adding task:', error)
      })
      .finally(() => {
        reset()
        setSubmitting(false)
      })
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="bg-white max-w-lg w-full p-5">
                <Dialog.Title>Edit Task</Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-2 mt-5"
                >
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={currentUpdateTask.title}
                    {...register('title', { required: true })}
                    className="outline-none border rounded-md p-2"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs animate-pulse">
                      Title is required
                    </p>
                  )}
                  <textarea
                    placeholder="Task Body"
                    rows={5}
                    value={currentUpdateTask.body}
                    {...register('desc', { required: true })}
                    className="outline-none border rounded-md p-2"
                  />
                  {errors.desc && (
                    <p className="text-red-500 text-xs animate-pulse">
                      Description is required
                    </p>
                  )}
                  <select
                    title="Priority"
                    value={currentUpdateTask.priority}
                    {...register('priority', { required: true })}
                    className="p-2 outline-none"
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                  </select>
                  {errors.priority && (
                    <p className="text-red-500 text-xs animate-pulse">
                      Priority is required
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-800 text-white p-2 rounded-md mt-5"
                  >
                    {submitting ? 'Editing...' : 'Edit'}
                  </button>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default EditModal
