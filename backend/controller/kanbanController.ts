import { Request, Response } from 'express'
import { ITasks } from '../types/interfaces'
import TaskModel from '../models/kanbanSchema'

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
  } catch (error: any) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message })
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
  } catch (error: any) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message })
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
  } catch (error: any) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message })
  }
}

export async function readTasks(req: Request, res: Response): Promise<void> {
  try {
    const tasks = await TaskModel.find({})
    res.json(tasks)
  } catch (error: any) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message })
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
  } catch (error: any) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Internal server error', message: error.message })
  }
}
