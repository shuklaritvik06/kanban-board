import express, { Router } from 'express'
import {
  readTasks,
  readTask,
  addTask,
  deleteTask,
  updateTask,
} from '../controller/kanbanController'

const router: Router = express.Router()

router.get('/tasks', readTasks)
router.get('/tasks/:id', readTask)
router.post('/tasks/add', addTask)
router.put('/tasks/update/:id', updateTask)
router.delete('/tasks/delete/:id', deleteTask)

export default router
