import { Request, Response } from 'express'
import { ITasks, Tasks } from '../types/interfaces'
import TaskModel from '../models/kanbanSchema'

function getTasks(tasks: any) {
  let todos = tasks.filter((task: any) => task.column === 1)
  let onProgress = tasks.filter((task: any) => task.column === 2)
  let doneTasks = tasks.filter((task: any) => task.column === 3)

  return { todos, onProgress, doneTasks }
}

export async function addTask(req: Request, res: Response): Promise<void> {
  try {
    const { title, body, priority, column } = req.body
    const task: ITasks = await TaskModel.create({
      title,
      body,
      priority,
      column,
    })
    res.status(201).json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const deletedTask = await TaskModel.findByIdAndDelete(id)
    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    const allTasks = await TaskModel.find({})
    res.json(allTasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    const allTasks = await TaskModel.find({})
    res.json(allTasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function readTasks(req: Request, res: Response): Promise<void> {
  try {
    const tasks = await TaskModel.find({})
    res.json(getTasks(tasks))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function readTask(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const task = await TaskModel.findById(id)
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
