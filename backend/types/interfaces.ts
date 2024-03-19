import { Document } from 'mongoose'

export interface ITasks extends Document {
  title: string
  body: string
  priority: string
  column: number
}

export interface Task {
  _id: string
  title: string
  body: string
  priority: string
  column: number
  createdAt: string
  updatedAt: string
  __v: number
}
