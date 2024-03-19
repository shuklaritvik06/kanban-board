import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Task } from '../../types/interfaces'

function Modal({
  isOpen,
  setIsOpen,
  setTasks,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
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
      .post('http://localhost:8000/tasks/add', {
        title: data.title,
        body: data.desc,
        priority: data.priority,
        column: 1,
      })
      .then((res) => {
        setTasks((prev) => [...prev, res.data])
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
          enter="duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <Transition.Child
          enter="duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="bg-white max-w-lg w-full p-5">
                <Dialog.Title>Add Task</Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-2 mt-5"
                >
                  <input
                    type="text"
                    placeholder="Task Title"
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
                    {submitting ? 'Adding...' : 'Add'}
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

export default Modal
