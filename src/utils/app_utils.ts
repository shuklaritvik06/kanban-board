import { Task } from '../../types/interfaces'

export const filterTasks = (tasks: Task[]) => {
  const todos = tasks.filter((item) => item.column === 1)
  const progress = tasks.filter((item) => item.column === 2)
  const done = tasks.filter((item) => item.column === 3)
  return { todos, progress, done }
}
